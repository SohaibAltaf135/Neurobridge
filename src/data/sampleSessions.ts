import { ProcessedStudySession } from '../types';

export const SAMPLE_SESSIONS: ProcessedStudySession[] = [
  {
    id: 'sample-biology-cell-respiration',
    title: 'Cellular Respiration & ATP Energy Flow',
    createdAt: new Date().toISOString(),
    readingTimeMinutes: 3,
    originalText: `Cellular respiration is a metabolic pathway that breaks down glucose and produces ATP. The stages of cellular respiration include glycolysis, pyruvate oxidation, the citric acid or Krebs cycle, and oxidative phosphorylation (electron transport chain and chemiosmosis). During glycolysis, glucose—a six-carbon sugar—undergoes a series of chemical transformations, converted into two molecules of pyruvate, generating a net of 2 ATP and 2 NADH. In pyruvate oxidation, each pyruvate from glycolysis goes into the mitochondrial matrix and is converted into a two-carbon molecule bound to Coenzyme A, known as acetyl CoA, releasing carbon dioxide and generating NADH. In the Krebs cycle, acetyl CoA combines with a four-carbon molecule and goes through a cycle of reactions, producing ATP, NADH, and FADH2 while releasing CO2. Finally, in oxidative phosphorylation, the NADH and FADH2 deposit their electrons in the electron transport chain, driving protons across the membrane to power ATP synthase, generating roughly 30 to 32 ATP per glucose molecule.`,
    plainEnglishSummary: `Cellular respiration is how your body's cells turn food (glucose sugar) into usable energy coins called ATP. It's like a 4-step energy factory: 1) Glycolysis chops sugar in half, 2) Pyruvate prep loads it for burning, 3) The Krebs cycle extracts high-energy fuel tickets (NADH), and 4) The Electron Transport Chain spins an microscopic turbine (ATP Synthase) to print 30+ energy coins per sugar!`,
    realWorldAnalogy: `Think of a smartphone battery and a power bank. Eating food is like buying raw crude oil. Your body cannot directly stick crude oil into your phone. Cellular respiration is the power plant that refines the oil and charges up thousands of little rechargeable AA batteries (ATP) that your muscles, brain, and heart can plug into instantly!`,
    bionicFormattedText: `Cellular respiration is how your body's cells turn food (glucose sugar) into usable energy coins called ATP. It's like a 4-step energy factory: Glycolysis chops sugar in half, Pyruvate prep loads it for burning, the Krebs cycle extracts high-energy fuel tickets, and the Electron Transport Chain spins an microscopic turbine to print 30+ energy coins per sugar!`,
    jargonTerms: [
      {
        term: 'ATP (Adenosine Triphosphate)',
        simpleDefinition: 'The universal energy currency of all living cells.',
        realWorldAnalogy: 'Like rechargeable AA batteries or game tokens your cells spend to do work.'
      },
      {
        term: 'Glycolysis',
        simpleDefinition: 'The initial breakdown of 1 glucose sugar into 2 smaller pyruvate pieces in the cell cytoplasm.',
        realWorldAnalogy: 'Snapping a large chocolate bar into two bite-sized pieces.'
      },
      {
        term: 'Mitochondria',
        simpleDefinition: 'The organelle where the energy-producing reactions (Krebs cycle & ETC) take place.',
        realWorldAnalogy: 'The power generator room in a factory building.'
      },
      {
        term: 'ATP Synthase',
        simpleDefinition: 'A molecular motor enzyme that spins to make ATP as hydrogen protons flow through it.',
        realWorldAnalogy: 'A hydroelectric water dam turbine that generates electricity when water rushes through.'
      }
    ],
    mindMap: {
      nodes: [
        { id: '1', label: 'Cellular Respiration', description: 'Overall process of converting glucose to ATP', category: 'core' },
        { id: '2', label: '1. Glycolysis', description: 'Splits glucose into 2 Pyruvate in cytoplasm', category: 'concept', parentId: '1' },
        { id: '3', label: '2. Pyruvate Oxidation', description: 'Converts pyruvate to Acetyl CoA inside mitochondria', category: 'concept', parentId: '1' },
        { id: '4', label: '3. Krebs Cycle', description: 'Cycles Acetyl CoA to generate NADH & FADH2 fuel', category: 'concept', parentId: '1' },
        { id: '5', label: '4. Electron Transport Chain', description: 'Powers ATP Synthase turbine to produce 30-32 ATP', category: 'concept', parentId: '1' },
        { id: '6', label: 'Net 2 ATP + 2 NADH', description: 'Fast anaerobic energy harvest', category: 'detail', parentId: '2' },
        { id: '7', label: 'CO2 Waste Released', description: 'Why we exhale carbon dioxide', category: 'detail', parentId: '3' },
        { id: '8', label: 'ATP Synthase Turbine', description: 'Proton gradient drives rotational energy generation', category: 'detail', parentId: '5' }
      ],
      edges: [
        { from: '1', to: '2', relation: 'starts with' },
        { from: '2', to: '3', relation: 'feeds into' },
        { from: '3', to: '4', relation: 'supplies' },
        { from: '4', to: '5', relation: 'charges electrons for' },
        { from: '2', to: '6', relation: 'yields' },
        { from: '3', to: '7', relation: 'produces' },
        { from: '5', to: '8', relation: 'powers' }
      ]
    },
    microTasks: [
      {
        id: 't1',
        title: 'Mission 1: Meet the Currency (ATP)',
        estimatedMinutes: 3,
        explanation: 'Understand why our cells need ATP instead of just raw glucose sugar.',
        actionItem: 'Say out loud: "Glucose is raw food, ATP is usable cell cash!"',
        completed: false
      },
      {
        id: 't2',
        title: 'Mission 2: Trace the 4 Steps',
        estimatedMinutes: 5,
        explanation: 'Visualize the 4 stations: Cytoplasm (Glycolysis) -> Mitochondria Door (Pyruvate Prep) -> Inner Room (Krebs) -> Wall Turbine (ETC).',
        actionItem: 'Click through the 4 nodes on the Mind Map visualizer above.',
        completed: false
      },
      {
        id: 't3',
        title: 'Mission 3: Master the Hydro Dam Analogy',
        estimatedMinutes: 4,
        explanation: 'Remember how ATP Synthase works: Hydrogen ions are water trapped behind a dam; as they rush through the gate, the turbine spins to make ATP.',
        actionItem: 'Flip through the 3 flashcards in the Active Recall tab.',
        completed: false
      }
    ],
    flashcards: [
      {
        id: 'fc1',
        question: 'What is the main purpose of cellular respiration?',
        answer: 'To break down glucose (sugar) and convert chemical bond energy into usable ATP molecules.',
        mnemonicHint: 'Think "Cellular Respiration = Charging the phone battery".'
      },
      {
        id: 'fc2',
        question: 'Where does Glycolysis take place, and does it require oxygen?',
        answer: 'In the cell cytoplasm (cytosol). It is anaerobic (does NOT require oxygen).',
        mnemonicHint: 'Glyco (sugar) + Lysis (cut) happens out in the open cytoplasm floor.'
      },
      {
        id: 'fc3',
        question: 'Which stage produces the largest amount of ATP?',
        answer: 'Oxidative Phosphorylation (the Electron Transport Chain & ATP Synthase), yielding about 26-28 of the 30-32 total ATP.',
        mnemonicHint: 'The Grand Finale turbine stage delivers ~90% of the jackpot!'
      }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Why can’t our muscles directly consume glucose sugar molecules to contract?',
        options: [
          'Glucose is poisonous to muscle fibers',
          'Cells require cellular "currency" (ATP) whose phosphate bonds release immediate, safe packets of energy',
          'Glucose is too heavy to enter human cells',
          'Muscles only use nitrogen for energy'
        ],
        correctIndex: 1,
        explanation: 'Correct! Glucose contains too much energy in one bond. ATP breaks it into bite-sized safe packets cells can use.'
      },
      {
        id: 'q2',
        question: 'If ATP Synthase were a machine in the real world, what would it resemble most?',
        options: [
          'A solar panel soaking up sunlight',
          'A hydroelectric dam turbine spinning as water flows through',
          'A toaster burning bread',
          'A microwave oven vibrating water molecules'
        ],
        correctIndex: 1,
        explanation: 'Spot on! Protons build up behind the inner membrane (the dam) and rush through ATP Synthase (the turbine), spinning it to forge ATP.'
      },
      {
        id: 'q3',
        question: 'Where does carbon dioxide (CO2) that we breathe out come from?',
        options: [
          'It is produced when plants breathe on our skin',
          'It is a byproduct stripped off pyruvate and carbons during the Krebs cycle inside our mitochondria',
          'It is created in our lungs from thin air',
          'It is produced only when we drink carbonated soda'
        ],
        correctIndex: 1,
        explanation: 'Exact! When the 6-carbon glucose is dismantled, the discarded carbon atoms combine with oxygen to form CO2 waste that enters the blood and exits via our breath.'
      }
    ]
  },
  {
    id: 'sample-physics-newtons-laws',
    title: 'Newton\'s Three Laws of Motion & Forces',
    createdAt: new Date().toISOString(),
    readingTimeMinutes: 2,
    originalText: `Newton's laws of motion are three basic laws of classical mechanics that describe the relationship between the motion of an object and the forces acting on it. The first law states that an object at rest remains at rest, and an object in motion remains in motion with constant velocity unless acted upon by a net external force (inertia). The second law states that the acceleration of an object is directly proportional to the net force acting upon it and inversely proportional to its mass, conventionally formulated as F = ma. The third law states that when one body exerts a force on a second body, the second body simultaneously exerts a force equal in magnitude and opposite in direction on the first body (action and reaction).`,
    plainEnglishSummary: `Isaac Newton figured out 3 universal rules for why things move or stop: 1) Objects are lazy (they keep doing whatever they are doing until something pushes them), 2) Heavy things need more muscle to speed up (Force = Mass × Acceleration), and 3) You cannot push something without it pushing back on you with the exact same strength!`,
    realWorldAnalogy: `1st Law: Why you lurch forward when a bus slams the brakes—your body was cruising and wants to keep cruising! 2nd Law: Why flicking a ping pong ball makes it zoom, but flicking a bowling ball hurts your finger. 3rd Law: When you jump off a skateboard, you go forward and the skateboard shoots backward.`,
    bionicFormattedText: `Isaac Newton figured out 3 universal rules for why things move or stop: 1) Objects are lazy (they keep doing whatever they are doing until something pushes them), 2) Heavy things need more muscle to speed up (Force = Mass × Acceleration), and 3) You cannot push something without it pushing back on you with the exact same strength!`,
    jargonTerms: [
      {
        term: 'Inertia (1st Law)',
        simpleDefinition: 'The natural resistance of any physical object to any change in its velocity or state of rest.',
        realWorldAnalogy: 'Couch potato syndrome—an object wants to stay exactly where it is.'
      },
      {
        term: 'F = ma (2nd Law)',
        simpleDefinition: 'Net Force equals Mass multiplied by Acceleration.',
        realWorldAnalogy: 'Pushing an empty shopping cart vs pushing a cart filled with 50 bricks.'
      },
      {
        term: 'Action-Reaction Pair (3rd Law)',
        simpleDefinition: 'Forces always occur in matched pairs: equal in magnitude, opposite in direction, acting on two different bodies.',
        realWorldAnalogy: 'Stepping off a floating boat onto a dock—you step forward, boat drifts backward.'
      }
    ],
    mindMap: {
      nodes: [
        { id: '1', label: 'Newton\'s Laws', description: 'Core principles of mechanics and movement', category: 'core' },
        { id: '2', label: '1st Law: Inertia', description: 'Objects resist changing their speed/direction', category: 'concept', parentId: '1' },
        { id: '3', label: '2nd Law: F = ma', description: 'Force needed depends on how heavy and how fast', category: 'concept', parentId: '1' },
        { id: '4', label: '3rd Law: Action & Reaction', description: 'Forces always come in equal and opposite pairs', category: 'concept', parentId: '1' },
        { id: '5', label: 'Seatbelt Effect', description: 'Inertia makes you keep moving when car stops', category: 'example', parentId: '2' },
        { id: '6', label: 'Rocket Propulsion', description: 'Exhaust pushed down pushes rocket up into space', category: 'example', parentId: '4' }
      ],
      edges: [
        { from: '1', to: '2', relation: 'Law 1' },
        { from: '1', to: '3', relation: 'Law 2' },
        { from: '1', to: '4', relation: 'Law 3' },
        { from: '2', to: '5', relation: 'real life example' },
        { from: '4', to: '6', relation: 'powers' }
      ]
    },
    microTasks: [
      {
        id: 't1',
        title: 'Mission 1: The "Lazy Object" Rule',
        estimatedMinutes: 2,
        explanation: 'Remember that things only move or stop if an outside force intervenes.',
        actionItem: 'Imagine sliding an ice hockey puck on infinite frictionless ice.',
        completed: false
      },
      {
        id: 't2',
        title: 'Mission 2: The Formula F = ma',
        estimatedMinutes: 3,
        explanation: 'Double the mass = needs double the force to speed up equally.',
        actionItem: 'Review the shopping cart analogy.',
        completed: false
      }
    ],
    flashcards: [
      {
        id: 'fc1',
        question: 'Why do you wear a seatbelt according to the 1st Law?',
        answer: 'Due to inertia, if the car suddenly stops, your body will continue moving forward at the car\'s previous speed until an external force (the seatbelt) stops you.',
        mnemonicHint: 'Inertia = In motion stays in motion!'
      },
      {
        id: 'fc2',
        question: 'If a massive truck and a light beetle collide, which exerts more force on the other?',
        answer: 'Neither! Newton\'s 3rd Law states they exert the EXACT SAME magnitude of force on each other (though the beetle undergoes much greater acceleration/damage due to its tiny mass).',
        mnemonicHint: 'Equal and opposite pairs—force is always identical!'
      }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'According to Newton’s 2nd Law (F = ma), if you double the force pushing a box, what happens to its acceleration?',
        options: [
          'It stays the same',
          'It cuts in half',
          'It doubles',
          'It drops to zero'
        ],
        correctIndex: 2,
        explanation: 'Exactly! Acceleration is directly proportional to Force. Double the push, double the acceleration.'
      }
    ]
  }
];
