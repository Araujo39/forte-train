/**
 * Sport-Specific AI Prompt System
 * Generates optimized prompts for OpenAI based on sport modality
 * Author: Senior Software Architect
 */

export interface SportPromptConfig {
  sportType: string
  systemRole: string
  metricStructure: object
  examples: string[]
  constraints: string[]
}

export const SPORT_PROMPTS: Record<string, SportPromptConfig> = {
  bodybuilding: {
    sportType: 'bodybuilding',
    systemRole: 'You are an expert bodybuilding and strength training coach with IFBB certification.',
    metricStructure: {
      exercises: [
        {
          name: 'Exercise name',
          muscle_groups: ['Primary', 'Secondary'],
          sets: 0,
          reps: 0,
          weight: 0,
          rest_seconds: 60,
          tempo: '3-1-1-0',
          notes: 'Execution tips'
        }
      ]
    },
    examples: [
      'Supino Reto - 4 sets x 12 reps @ 80kg',
      'Agachamento Livre - 5 sets x 8 reps @ 120kg'
    ],
    constraints: [
      'Always include proper rest periods (45-90s)',
      'Specify tempo (eccentric-pause-concentric-pause)',
      'Include muscle groups worked',
      'Provide execution cues'
    ]
  },

  cycling: {
    sportType: 'cycling',
    systemRole: 'You are a professional cycling coach certified by UCI with expertise in power-based training.',
    metricStructure: {
      workout_type: 'Endurance | Intervals | Recovery | Tempo',
      distance: '0km',
      elevation_gain: '0m',
      target_zones: {
        Z1: '0min',
        Z2: '0min',
        Z3: '0min',
        Z4: '0min',
        Z5: '0min'
      },
      intervals: [
        {
          duration: '5min',
          power_target: '250W',
          cadence: '90rpm',
          recovery: '3min'
        }
      ],
      avg_power: 0,
      normalized_power: 0,
      intensity_factor: 0.0,
      terrain: 'Flat | Hilly | Mixed'
    },
    examples: [
      'Sweet Spot Intervals: 3x15min @ 88-93% FTP, 5min recovery',
      'Endurance Ride: 90km @ Z2, 800m elevation'
    ],
    constraints: [
      'Always specify power zones (FTP-based)',
      'Include cadence targets',
      'Define recovery periods',
      'Specify terrain type',
      'Calculate TSS (Training Stress Score)'
    ]
  },

  tennis: {
    sportType: 'tennis',
    systemRole: 'You are a professional tennis coach with ITF Level 3 certification and experience coaching ATP/WTA players.',
    metricStructure: {
      session_type: 'Technical | Tactical | Physical | Match Simulation',
      drills: [
        {
          name: 'Drill name',
          type: 'Serve | Forehand | Backhand | Volley | Footwork',
          duration: '20min',
          intensity: 'Low | Medium | High',
          repetitions: 0,
          focus_points: ['Technique', 'Placement', 'Power'],
          equipment: ['Cones', 'Targets']
        }
      ],
      match_scenarios: [
        {
          situation: 'Break point defense',
          duration: '15min',
          patterns: []
        }
      ],
      physical_conditioning: {
        court_sprints: 0,
        shadow_swings: 0,
        medicine_ball: 0
      }
    },
    examples: [
      'Serve & Volley Drill: 50 reps, focus on split-step timing',
      'Baseline Rally: 20min, crosscourt consistency, 80% pace'
    ],
    constraints: [
      'Specify shot type and target area',
      'Include footwork patterns',
      'Define intensity (Low/Medium/High)',
      'Add tactical focus',
      'Include court positions'
    ]
  },

  swimming: {
    sportType: 'swimming',
    systemRole: 'You are an elite swimming coach certified by FINA with Olympic-level experience.',
    metricStructure: {
      total_distance: '0m',
      workout_type: 'Technique | Endurance | Speed | IM',
      strokes: ['Freestyle', 'Backstroke', 'Breaststroke', 'Butterfly'],
      sets: [
        {
          distance: '200m',
          stroke: 'Freestyle',
          intensity: 'Easy | Moderate | Hard | Sprint',
          interval: '3:00',
          rest: '30s',
          focus: 'Technique | Endurance | Speed',
          equipment: ['Pull buoy', 'Paddles', 'Fins', 'Kickboard']
        }
      ],
      warm_up: '400m easy',
      cool_down: '200m easy',
      technique_drills: []
    },
    examples: [
      'Main Set: 10x100m Freestyle @ 1:30, rest 20s, focus on catch',
      'IM Set: 4x200m IM @ 3:30, descending pace'
    ],
    constraints: [
      'Specify stroke type',
      'Include interval times',
      'Define intensity level',
      'Add technique focus',
      'Mention equipment if needed',
      'Always include warm-up/cool-down'
    ]
  },

  beach_tennis: {
    sportType: 'beach_tennis',
    systemRole: 'You are a professional beach tennis coach certified by ITF Beach Tennis.',
    metricStructure: {
      session_type: 'Technical | Physical | Match Play',
      drills: [
        {
          name: 'Drill name',
          type: 'Serve | Smash | Volley | Defense',
          duration: '15min',
          intensity: 'Medium | High',
          sand_conditions: 'Soft | Hard | Wet',
          focus: 'Power | Placement | Movement'
        }
      ],
      match_simulation: {
        duration: '30min',
        format: 'Singles | Doubles',
        scoring: 'Best of 3 | Timed',
        tactics_focus: []
      },
      sand_conditioning: {
        sprint_drills: 0,
        jump_training: 0,
        lateral_movement: 0
      }
    },
    examples: [
      'Smash Drill: 40 reps, focus on timing and power',
      'Doubles Positioning: 20min, net coverage patterns'
    ],
    constraints: [
      'Account for sand resistance',
      'Include explosive movements',
      'Specify court positioning',
      'Add sun/wind considerations',
      'Focus on quick reactions'
    ]
  },

  crossfit: {
    sportType: 'crossfit',
    systemRole: 'You are a CrossFit Level 3 Coach (CF-L3) with experience programming for competitive athletes.',
    metricStructure: {
      wod_type: 'AMRAP | EMOM | For Time | Chipper | Tabata',
      time_cap: '20min',
      movements: [
        {
          name: 'Movement name',
          reps: 0,
          weight: 0,
          rx_standard: 'RX | Scaled',
          scaling_options: []
        }
      ],
      warm_up: {
        general: 'Row 500m',
        specific: [],
        mobility: []
      },
      skill_work: {
        movement: '',
        duration: '10min',
        focus: ''
      },
      strength: {
        movement: '',
        sets: 0,
        reps: 0,
        percentage: '0% 1RM'
      },
      metcon: {
        format: 'AMRAP | For Time',
        description: ''
      }
    },
    examples: [
      'Fran: 21-15-9 Thrusters (95lbs) + Pull-ups, For Time',
      'AMRAP 20min: 5 Pull-ups, 10 Push-ups, 15 Air Squats'
    ],
    constraints: [
      'Specify RX and Scaled weights',
      'Include time cap',
      'Define movement standards',
      'Add scaling options',
      'Balance gymnastics, weightlifting, and monostructural',
      'Provide benchmark WOD names if applicable'
    ]
  },

  running: {
    sportType: 'running',
    systemRole: 'You are a certified running coach (USATF Level 2) with marathon and ultra-distance expertise.',
    metricStructure: {
      workout_type: 'Easy | Tempo | Intervals | Long Run | Recovery',
      total_distance: '0km',
      target_pace: '5:00/km',
      intervals: [
        {
          distance: '1km',
          pace: '4:30/km',
          recovery: '400m jog',
          heart_rate_zone: 'Z2 | Z3 | Z4 | Z5'
        }
      ],
      terrain: 'Road | Trail | Track | Mixed',
      elevation_gain: '0m',
      cadence: 0,
      stride_length: 0,
      warm_up: '2km easy',
      cool_down: '1km easy',
      drills: []
    },
    examples: [
      'Tempo Run: 10km @ Lactate Threshold (4:45/km)',
      'Yasso 800s: 10x800m @ 3:20, 400m jog recovery'
    ],
    constraints: [
      'Specify pace zones',
      'Include elevation profile',
      'Define recovery periods',
      'Add heart rate zones',
      'Mention terrain type',
      'Include dynamic warm-up drills'
    ]
  },

  pilates: {
    sportType: 'pilates',
    systemRole: 'You are a certified Pilates instructor (PMA/NCPT) with expertise in mat and reformer work.',
    metricStructure: {
      session_type: 'Mat | Reformer | Cadillac | Chair',
      focus_area: 'Core | Flexibility | Strength | Posture | Rehabilitation',
      exercises: [
        {
          name: 'Exercise name',
          repetitions: 0,
          duration: '60s',
          breathing_pattern: 'Inhale on..., Exhale on...',
          modifications: [],
          equipment: ['Mat', 'Ring', 'Ball', 'Bands'],
          cues: []
        }
      ],
      intensity: 'Beginner | Intermediate | Advanced',
      breath_work: {
        pattern: 'Lateral breathing',
        emphasis: 'Exhale on exertion'
      }
    },
    examples: [
      'The Hundred: 10 breaths x 10 pulses, neutral spine',
      'Teaser Series: 3 variations, focus on controlled movement'
    ],
    constraints: [
      'Emphasize breathing patterns',
      'Include alignment cues',
      'Specify equipment needed',
      'Add modifications for different levels',
      'Focus on mind-body connection',
      'Include postural awareness'
    ]
  },

  physiotherapy: {
    sportType: 'physiotherapy',
    systemRole: 'You are a licensed physiotherapist (DPT) specializing in sports rehabilitation and injury prevention.',
    metricStructure: {
      session_type: 'Rehabilitation | Prevention | Mobility | Strength',
      target_area: 'Knee | Shoulder | Back | Ankle | Hip',
      phase: 'Acute | Subacute | Chronic | Return to Sport',
      exercises: [
        {
          name: 'Exercise name',
          sets: 0,
          reps: 0,
          hold_time: '30s',
          pain_threshold: 'No pain | Mild discomfort (3/10) | Stop if pain',
          progressions: [],
          regressions: [],
          equipment: ['Resistance band', 'Foam roller', 'Balance pad']
        }
      ],
      pain_level_pre: 0,
      pain_level_post: 0,
      rom_assessment: {},
      contraindications: [],
      home_exercise_program: []
    },
    examples: [
      'Rotator Cuff Rehab: External rotation 3x15 @ green band',
      'Ankle Mobility: Dorsiflexion stretches 3x30s, balance exercises'
    ],
    constraints: [
      'Always include pain scale monitoring',
      'Specify movement progressions',
      'Add safety precautions',
      'Include ROM (Range of Motion) targets',
      'Provide home exercise program',
      'Note contraindications',
      'Use evidence-based protocols'
    ]
  }
}

/**
 * Generate sport-specific AI prompt for workout creation
 */
export function generateSportPrompt(
  sportType: string,
  studentGoal: string,
  studentLevel: string,
  additionalContext?: string
): string {
  const config = SPORT_PROMPTS[sportType]
  
  if (!config) {
    throw new Error(`Unknown sport type: ${sportType}`)
  }

  const prompt = `
${config.systemRole}

SPORT: ${config.sportType.toUpperCase()}
STUDENT GOAL: ${studentGoal}
EXPERIENCE LEVEL: ${studentLevel}
${additionalContext ? `ADDITIONAL CONTEXT: ${additionalContext}` : ''}

TASK: Create a comprehensive, structured workout/training session.

REQUIRED JSON OUTPUT STRUCTURE:
${JSON.stringify(config.metricStructure, null, 2)}

CONSTRAINTS:
${config.constraints.map((c, i) => `${i + 1}. ${c}`).join('\n')}

EXAMPLES FOR REFERENCE:
${config.examples.map((e, i) => `${i + 1}. ${e}`).join('\n')}

OUTPUT REQUIREMENTS:
1. Return ONLY valid JSON (no markdown, no explanations)
2. Use the exact structure provided above
3. Fill all fields with realistic, progressive values
4. Ensure workout is appropriate for the stated experience level
5. Include safety considerations and proper progressions

Generate the workout now:
`.trim()

  return prompt
}

/**
 * Get sport display configuration
 */
export function getSportConfig(sportType: string) {
  const configs = {
    bodybuilding: {
      name: 'Musculação',
      icon: 'dumbbell',
      color: '#CCFF00',
      secondaryColor: '#99FF00'
    },
    cycling: {
      name: 'Ciclismo',
      icon: 'bike',
      color: '#00D4FF',
      secondaryColor: '#0099CC'
    },
    tennis: {
      name: 'Tênis',
      icon: 'circle-dot',
      color: '#FFD700',
      secondaryColor: '#FFA500'
    },
    swimming: {
      name: 'Natação',
      icon: 'waves',
      color: '#00CED1',
      secondaryColor: '#008B8B'
    },
    beach_tennis: {
      name: 'Beach Tennis',
      icon: 'sun',
      color: '#FF6B35',
      secondaryColor: '#FF4757'
    },
    crossfit: {
      name: 'CrossFit',
      icon: 'zap',
      color: '#FF0000',
      secondaryColor: '#CC0000'
    },
    running: {
      name: 'Corrida',
      icon: 'footprints',
      color: '#7CFC00',
      secondaryColor: '#32CD32'
    },
    pilates: {
      name: 'Pilates',
      icon: 'circle',
      color: '#FF69B4',
      secondaryColor: '#FF1493'
    },
    physiotherapy: {
      name: 'Fisioterapia',
      icon: 'heart-pulse',
      color: '#9370DB',
      secondaryColor: '#6A5ACD'
    }
  }

  return configs[sportType as keyof typeof configs] || configs.bodybuilding
}
