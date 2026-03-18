import { Hono } from 'hono'
import { verify } from './jwt-helper'
import { generateId } from './utils-helper'
import { MercadoPagoClient, getPlanPrice, getPlanName, mapMercadoPagoStatus, mapSubscriptionStatus } from '../mercadopago'

type Bindings = {
  DB: D1Database
  JWT_SECRET: string
  MERCADOPAGO_ACCESS_TOKEN: string
  MERCADOPAGO_PUBLIC_KEY: string
  MERCADOPAGO_WEBHOOK_SECRET: string
}

export const paymentsRoutes = new Hono<{ Bindings: Bindings }>()

// ==================== CHECKOUT & PAYMENTS ====================

// POST /api/payments/create-preference - Create checkout for plan purchase
paymentsRoutes.post('/create-preference', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authHeader.substring(7)
    const payload = await verify(token, c.env.JWT_SECRET)
    
    if (!payload.tenantId) {
      return c.json({ error: 'Invalid token' }, 401)
    }

    const { plan_type, billing_cycle } = await c.req.json()

    if (!plan_type || !billing_cycle) {
      return c.json({ error: 'Missing plan_type or billing_cycle' }, 400)
    }

    // Get tenant info
    const tenant = await c.env.DB.prepare(
      'SELECT id, name, email FROM tenants WHERE id = ?'
    ).bind(payload.tenantId).first()

    if (!tenant) {
      return c.json({ error: 'Tenant not found' }, 404)
    }

    const price = getPlanPrice(plan_type, billing_cycle)
    const planName = getPlanName(plan_type)

    // Initialize Mercado Pago client
    const mp = new MercadoPagoClient({
      accessToken: c.env.MERCADOPAGO_ACCESS_TOKEN,
      publicKey: c.env.MERCADOPAGO_PUBLIC_KEY
    })

    // Create external reference
    const externalReference = `fortetrain-${payload.tenantId}-${Date.now()}`

    // Create preference
    const preference = await mp.createPreference({
      items: [
        {
          title: planName,
          description: `Assinatura ${billing_cycle === 'monthly' ? 'Mensal' : 'Anual'}`,
          quantity: 1,
          unit_price: price,
          currency_id: 'BRL'
        }
      ],
      payer: {
        name: tenant.name as string,
        email: tenant.email as string
      },
      back_urls: {
        success: 'https://fortetrain.pages.dev/dashboard?payment=success',
        failure: 'https://fortetrain.pages.dev/dashboard?payment=failure',
        pending: 'https://fortetrain.pages.dev/dashboard?payment=pending'
      },
      auto_return: 'approved',
      external_reference: externalReference,
      notification_url: 'https://fortetrain.pages.dev/api/payments/webhook',
      metadata: {
        tenant_id: payload.tenantId,
        plan_type,
        billing_cycle
      }
    })

    return c.json({
      success: true,
      preference_id: preference.id,
      init_point: preference.init_point, // Redirect URL
      sandbox_init_point: preference.sandbox_init_point,
      external_reference: externalReference
    })

  } catch (error: any) {
    console.error('Create preference error:', error)
    return c.json({ error: error.message || 'Failed to create checkout' }, 500)
  }
})

// POST /api/payments/create-subscription - Create recurring subscription
paymentsRoutes.post('/create-subscription', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authHeader.substring(7)
    const payload = await verify(token, c.env.JWT_SECRET)
    
    if (!payload.tenantId) {
      return c.json({ error: 'Invalid token' }, 401)
    }

    const { plan_type } = await c.req.json()

    if (!plan_type) {
      return c.json({ error: 'Missing plan_type' }, 400)
    }

    // Get tenant info
    const tenant = await c.env.DB.prepare(
      'SELECT id, name, email FROM tenants WHERE id = ?'
    ).bind(payload.tenantId).first()

    if (!tenant) {
      return c.json({ error: 'Tenant not found' }, 404)
    }

    const price = getPlanPrice(plan_type, 'monthly')
    const planName = getPlanName(plan_type)

    // Initialize Mercado Pago client
    const mp = new MercadoPagoClient({
      accessToken: c.env.MERCADOPAGO_ACCESS_TOKEN,
      publicKey: c.env.MERCADOPAGO_PUBLIC_KEY
    })

    // Create subscription (preapproval)
    const subscription = await mp.createSubscription({
      reason: planName,
      auto_recurring: {
        frequency: 1,
        frequency_type: 'months',
        transaction_amount: price,
        currency_id: 'BRL'
      },
      back_url: 'https://fortetrain.pages.dev/dashboard?subscription=success',
      payer_email: tenant.email as string,
      external_reference: `fortetrain-sub-${payload.tenantId}-${Date.now()}`
    })

    // Save subscription to database
    const subscriptionId = generateId()
    const now = Math.floor(Date.now() / 1000)
    const nextBillingDate = now + 2592000 // 30 days

    await c.env.DB.prepare(`
      INSERT INTO subscriptions 
      (id, tenant_id, plan_type, status, mrr, billing_cycle, 
       start_date, mercadopago_preapproval_id, next_billing_date, auto_recurring)
      VALUES (?, ?, ?, 'active', ?, 'monthly', ?, ?, ?, 1)
    `).bind(
      subscriptionId,
      payload.tenantId,
      plan_type,
      price,
      now,
      subscription.id,
      nextBillingDate
    ).run()

    return c.json({
      success: true,
      subscription_id: subscriptionId,
      mercadopago_subscription_id: subscription.id,
      init_point: subscription.init_point,
      status: subscription.status
    })

  } catch (error: any) {
    console.error('Create subscription error:', error)
    return c.json({ error: error.message || 'Failed to create subscription' }, 500)
  }
})

// GET /api/payments/subscription-status - Check subscription status
paymentsRoutes.get('/subscription-status', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authHeader.substring(7)
    const payload = await verify(token, c.env.JWT_SECRET)
    
    if (!payload.tenantId) {
      return c.json({ error: 'Invalid token' }, 401)
    }

    // Get active subscription
    const subscription = await c.env.DB.prepare(`
      SELECT * FROM subscriptions 
      WHERE tenant_id = ? AND status != 'cancelled'
      ORDER BY created_at DESC LIMIT 1
    `).bind(payload.tenantId).first()

    if (!subscription) {
      return c.json({ 
        has_subscription: false,
        status: 'none'
      })
    }

    // If subscription has MP ID, fetch latest status
    if (subscription.mercadopago_preapproval_id) {
      const mp = new MercadoPagoClient({
        accessToken: c.env.MERCADOPAGO_ACCESS_TOKEN,
        publicKey: c.env.MERCADOPAGO_PUBLIC_KEY
      })

      try {
        const mpSubscription = await mp.getSubscription(subscription.mercadopago_preapproval_id as string)
        
        // Update status in DB
        const internalStatus = mapSubscriptionStatus(mpSubscription.status)
        await c.env.DB.prepare(
          'UPDATE subscriptions SET status = ? WHERE id = ?'
        ).bind(internalStatus, subscription.id).run()

        return c.json({
          has_subscription: true,
          status: internalStatus,
          plan_type: subscription.plan_type,
          mrr: subscription.mrr,
          next_billing_date: subscription.next_billing_date,
          mercadopago_status: mpSubscription.status
        })
      } catch (error) {
        console.error('Error fetching MP subscription:', error)
      }
    }

    return c.json({
      has_subscription: true,
      status: subscription.status,
      plan_type: subscription.plan_type,
      mrr: subscription.mrr,
      next_billing_date: subscription.next_billing_date
    })

  } catch (error: any) {
    console.error('Get subscription status error:', error)
    return c.json({ error: 'Failed to fetch subscription status' }, 500)
  }
})

// POST /api/payments/cancel-subscription - Cancel active subscription
paymentsRoutes.post('/cancel-subscription', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authHeader.substring(7)
    const payload = await verify(token, c.env.JWT_SECRET)
    
    if (!payload.tenantId) {
      return c.json({ error: 'Invalid token' }, 401)
    }

    // Get active subscription
    const subscription = await c.env.DB.prepare(`
      SELECT * FROM subscriptions 
      WHERE tenant_id = ? AND status = 'active'
      ORDER BY created_at DESC LIMIT 1
    `).bind(payload.tenantId).first()

    if (!subscription) {
      return c.json({ error: 'No active subscription found' }, 404)
    }

    // Cancel in Mercado Pago if preapproval_id exists
    if (subscription.mercadopago_preapproval_id) {
      const mp = new MercadoPagoClient({
        accessToken: c.env.MERCADOPAGO_ACCESS_TOKEN,
        publicKey: c.env.MERCADOPAGO_PUBLIC_KEY
      })

      await mp.cancelSubscription(subscription.mercadopago_preapproval_id as string)
    }

    // Update in database
    const now = Math.floor(Date.now() / 1000)
    await c.env.DB.prepare(`
      UPDATE subscriptions 
      SET status = 'cancelled', cancelled_at = ?, end_date = ?
      WHERE id = ?
    `).bind(now, now, subscription.id).run()

    return c.json({
      success: true,
      message: 'Subscription cancelled successfully'
    })

  } catch (error: any) {
    console.error('Cancel subscription error:', error)
    return c.json({ error: error.message || 'Failed to cancel subscription' }, 500)
  }
})

// ==================== WEBHOOK HANDLER ====================

// POST /api/payments/webhook - Mercado Pago webhook receiver
paymentsRoutes.post('/webhook', async (c) => {
  try {
    const body = await c.req.json()
    const webhookId = generateId()
    const now = Math.floor(Date.now() / 1000)

    console.log('Received Mercado Pago webhook:', body)

    // Log webhook
    await c.env.DB.prepare(`
      INSERT INTO mercadopago_webhook_logs 
      (id, webhook_type, action, data_id, raw_payload, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      webhookId,
      body.type || 'unknown',
      body.action || 'unknown',
      body.data?.id || 'unknown',
      JSON.stringify(body),
      now
    ).run()

    // Process webhook based on type
    if (body.type === 'payment') {
      await processPaymentWebhook(c.env, body)
    } else if (body.type === 'subscription_preapproval') {
      await processSubscriptionWebhook(c.env, body)
    }

    // Mark as processed
    await c.env.DB.prepare(
      'UPDATE mercadopago_webhook_logs SET processed = 1, processed_at = ? WHERE id = ?'
    ).bind(now, webhookId).run()

    return c.json({ success: true })

  } catch (error: any) {
    console.error('Webhook processing error:', error)
    return c.json({ error: 'Webhook processing failed' }, 500)
  }
})

// ==================== HELPER FUNCTIONS ====================

async function processPaymentWebhook(env: any, webhook: any) {
  const paymentId = webhook.data?.id
  if (!paymentId) return

  const mp = new MercadoPagoClient({
    accessToken: env.MERCADOPAGO_ACCESS_TOKEN,
    publicKey: env.MERCADOPAGO_PUBLIC_KEY
  })

  // Fetch payment details
  const payment = await mp.getPayment(paymentId)

  // Extract external reference to find tenant
  const externalReference = payment.external_reference
  const tenantId = externalReference?.split('-')[1] // fortetrain-{tenantId}-{timestamp}

  if (!tenantId) {
    console.error('Could not extract tenant_id from external_reference')
    return
  }

  // Save payment to database
  const paymentDbId = generateId()
  const now = Math.floor(Date.now() / 1000)
  const internalStatus = mapMercadoPagoStatus(payment.status)

  await env.DB.prepare(`
    INSERT INTO payments 
    (id, tenant_id, amount, currency, status, payment_method, 
     mercadopago_payment_id, payment_type, transaction_amount, 
     net_amount, mercadopago_fee, status_detail, external_reference, 
     paid_at, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    paymentDbId,
    tenantId,
    payment.transaction_amount,
    payment.currency_id,
    internalStatus,
    payment.payment_method_id,
    payment.id,
    payment.payment_type_id,
    payment.transaction_amount,
    payment.transaction_amount - (payment.fee_details?.reduce((sum: number, fee: any) => sum + fee.amount, 0) || 0),
    payment.fee_details?.reduce((sum: number, fee: any) => sum + fee.amount, 0) || 0,
    payment.status_detail,
    externalReference,
    payment.status === 'approved' ? now : null,
    now
  ).run()

  // If payment approved, update subscription status
  if (payment.status === 'approved') {
    await env.DB.prepare(
      "UPDATE subscriptions SET status = 'active' WHERE tenant_id = ? AND status = 'trial'"
    ).bind(tenantId).run()
  }
}

async function processSubscriptionWebhook(env: any, webhook: any) {
  const subscriptionId = webhook.data?.id
  if (!subscriptionId) return

  const mp = new MercadoPagoClient({
    accessToken: env.MERCADOPAGO_ACCESS_TOKEN,
    publicKey: env.MERCADOPAGO_PUBLIC_KEY
  })

  // Fetch subscription details
  const subscription = await mp.getSubscription(subscriptionId)
  const internalStatus = mapSubscriptionStatus(subscription.status)

  // Update subscription in database
  await env.DB.prepare(
    'UPDATE subscriptions SET status = ? WHERE mercadopago_preapproval_id = ?'
  ).bind(internalStatus, subscriptionId).run()
}

export default paymentsRoutes
