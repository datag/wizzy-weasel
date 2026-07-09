import type { HardwareItem } from '@/types'

function a(textKey: string, correct: boolean) {
  return { textKey, correct }
}

export const HARDWARE_ITEMS: HardwareItem[] = [
  {
    id: 'access-point',
    nameKey: 'itHardwareQuiz.hardware.access-point',
    image: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Access_Point_UniFi.jpg',
    emoji: '📡',
    questions: [
      {
        id: 'ap-q1',
        questionKey: 'itHardwareQuiz.q.ap-q1',
        type: 'single',
        answers: [
          a('itHardwareQuiz.q.ap-a1-1', true),
          a('itHardwareQuiz.q.ap-a1-2', false),
          a('itHardwareQuiz.q.ap-a1-3', false),
          a('itHardwareQuiz.q.ap-a1-4', false),
          a('itHardwareQuiz.q.ap-a1-5', false),
        ],
      },
      {
        id: 'ap-q2',
        questionKey: 'itHardwareQuiz.q.ap-q2',
        type: 'single',
        answers: [
          a('itHardwareQuiz.q.ap-a2-1', true),
          a('itHardwareQuiz.q.ap-a2-2', false),
          a('itHardwareQuiz.q.ap-a2-3', false),
          a('itHardwareQuiz.q.ap-a2-4', false),
          a('itHardwareQuiz.q.ap-a2-5', false),
        ],
      },
    ],
  },
  {
    id: 'ssd',
    nameKey: 'itHardwareQuiz.hardware.ssd',
    image: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Vertex_2_Solid_State_Drive_by_OCZ-top_oblique_PNr%C2%B00307.jpg',
    emoji: '💾',
    questions: [
      {
        id: 'ssd-q1',
        questionKey: 'itHardwareQuiz.q.ssd-q1',
        type: 'single',
        answers: [
          a('itHardwareQuiz.q.ssd-a1-1', true),
          a('itHardwareQuiz.q.ssd-a1-2', false),
          a('itHardwareQuiz.q.ssd-a1-3', false),
          a('itHardwareQuiz.q.ssd-a1-4', false),
          a('itHardwareQuiz.q.ssd-a1-5', false),
        ],
      },
      {
        id: 'ssd-q2',
        questionKey: 'itHardwareQuiz.q.ssd-q2',
        type: 'multiple',
        correctCount: 2,
        answers: [
          a('itHardwareQuiz.q.ssd-a2-1', true),
          a('itHardwareQuiz.q.ssd-a2-2', true),
          a('itHardwareQuiz.q.ssd-a2-3', false),
          a('itHardwareQuiz.q.ssd-a2-4', false),
          a('itHardwareQuiz.q.ssd-a2-5', false),
        ],
      },
      {
        id: 'ssd-q3',
        questionKey: 'itHardwareQuiz.q.ssd-q3',
        type: 'single',
        answers: [
          a('itHardwareQuiz.q.ssd-a3-1', true),
          a('itHardwareQuiz.q.ssd-a3-2', false),
          a('itHardwareQuiz.q.ssd-a3-3', false),
          a('itHardwareQuiz.q.ssd-a3-4', false),
          a('itHardwareQuiz.q.ssd-a3-5', false),
        ],
      },
    ],
  },
  {
    id: 'switch',
    nameKey: 'itHardwareQuiz.hardware.switch',
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Netgear_Gigabit_Switch_5-port.jpg',
    emoji: '🔀',
    questions: [
      {
        id: 'sw-q1',
        questionKey: 'itHardwareQuiz.q.sw-q1',
        type: 'single',
        answers: [
          a('itHardwareQuiz.q.sw-a1-1', true),
          a('itHardwareQuiz.q.sw-a1-2', false),
          a('itHardwareQuiz.q.sw-a1-3', false),
          a('itHardwareQuiz.q.sw-a1-4', false),
          a('itHardwareQuiz.q.sw-a1-5', false),
        ],
      },
      {
        id: 'sw-q2',
        questionKey: 'itHardwareQuiz.q.sw-q2',
        type: 'single',
        answers: [
          a('itHardwareQuiz.q.sw-a2-1', true),
          a('itHardwareQuiz.q.sw-a2-2', false),
          a('itHardwareQuiz.q.sw-a2-3', false),
          a('itHardwareQuiz.q.sw-a2-4', false),
          a('itHardwareQuiz.q.sw-a2-5', false),
        ],
      },
    ],
  },
  {
    id: 'psu',
    nameKey: 'itHardwareQuiz.hardware.psu',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/ATX-Netzteil.jpg',
    emoji: '🔌',
    questions: [
      {
        id: 'psu-q1',
        questionKey: 'itHardwareQuiz.q.psu-q1',
        type: 'single',
        answers: [
          a('itHardwareQuiz.q.psu-a1-1', true),
          a('itHardwareQuiz.q.psu-a1-2', false),
          a('itHardwareQuiz.q.psu-a1-3', false),
          a('itHardwareQuiz.q.psu-a1-4', false),
          a('itHardwareQuiz.q.psu-a1-5', false),
        ],
      },
      {
        id: 'psu-q2',
        questionKey: 'itHardwareQuiz.q.psu-q2',
        type: 'single',
        answers: [
          a('itHardwareQuiz.q.psu-a2-1', true),
          a('itHardwareQuiz.q.psu-a2-2', false),
          a('itHardwareQuiz.q.psu-a2-3', false),
          a('itHardwareQuiz.q.psu-a2-4', false),
          a('itHardwareQuiz.q.psu-a2-5', false),
        ],
      },
    ],
  },
  {
    id: 'monitor',
    nameKey: 'itHardwareQuiz.hardware.monitor',
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Computer_monitor.jpg',
    emoji: '🖥️',
    questions: [
      {
        id: 'mon-q1',
        questionKey: 'itHardwareQuiz.q.mon-q1',
        type: 'single',
        answers: [
          a('itHardwareQuiz.q.mon-a1-1', true),
          a('itHardwareQuiz.q.mon-a1-2', false),
          a('itHardwareQuiz.q.mon-a1-3', false),
          a('itHardwareQuiz.q.mon-a1-4', false),
          a('itHardwareQuiz.q.mon-a1-5', false),
        ],
      },
      {
        id: 'mon-q2',
        questionKey: 'itHardwareQuiz.q.mon-q2',
        type: 'single',
        answers: [
          a('itHardwareQuiz.q.mon-a2-1', true),
          a('itHardwareQuiz.q.mon-a2-2', false),
          a('itHardwareQuiz.q.mon-a2-3', false),
          a('itHardwareQuiz.q.mon-a2-4', false),
          a('itHardwareQuiz.q.mon-a2-5', false),
        ],
      },
    ],
  },
  {
    id: 'keyboard',
    nameKey: 'itHardwareQuiz.hardware.keyboard',
    image: 'https://upload.wikimedia.org/wikipedia/commons/5/54/Hintergrundbeleuchtete_Computer-Tastatur_%28no_name%29_2022-09-03_Mattes.jpg',
    emoji: '⌨️',
    questions: [
      {
        id: 'kb-q1',
        questionKey: 'itHardwareQuiz.q.kb-q1',
        type: 'single',
        answers: [
          a('itHardwareQuiz.q.kb-a1-1', true),
          a('itHardwareQuiz.q.kb-a1-2', false),
          a('itHardwareQuiz.q.kb-a1-3', false),
          a('itHardwareQuiz.q.kb-a1-4', false),
          a('itHardwareQuiz.q.kb-a1-5', false),
        ],
      },
      {
        id: 'kb-q2',
        questionKey: 'itHardwareQuiz.q.kb-q2',
        type: 'multiple',
        correctCount: 2,
        answers: [
          a('itHardwareQuiz.q.kb-a2-1', true),
          a('itHardwareQuiz.q.kb-a2-2', true),
          a('itHardwareQuiz.q.kb-a2-3', false),
          a('itHardwareQuiz.q.kb-a2-4', false),
          a('itHardwareQuiz.q.kb-a2-5', false),
        ],
      },
    ],
  },
  {
    id: 'mouse',
    nameKey: 'itHardwareQuiz.hardware.mouse',
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Razer_DeathAdder_Elite-front_oblique-ar_16to10-fs_PNr%C2%B00465.jpg',
    emoji: '🖱️',
    questions: [
      {
        id: 'ms-q1',
        questionKey: 'itHardwareQuiz.q.ms-q1',
        type: 'single',
        answers: [
          a('itHardwareQuiz.q.ms-a1-1', true),
          a('itHardwareQuiz.q.ms-a1-2', false),
          a('itHardwareQuiz.q.ms-a1-3', false),
          a('itHardwareQuiz.q.ms-a1-4', false),
          a('itHardwareQuiz.q.ms-a1-5', false),
        ],
      },
      {
        id: 'ms-q2',
        questionKey: 'itHardwareQuiz.q.ms-q2',
        type: 'single',
        answers: [
          a('itHardwareQuiz.q.ms-a2-1', true),
          a('itHardwareQuiz.q.ms-a2-2', false),
          a('itHardwareQuiz.q.ms-a2-3', false),
          a('itHardwareQuiz.q.ms-a2-4', false),
          a('itHardwareQuiz.q.ms-a2-5', false),
        ],
      },
    ],
  },
  {
    id: 'router',
    nameKey: 'itHardwareQuiz.hardware.router',
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Fritz%21Box_7590-7409.jpg',
    emoji: '📶',
    questions: [
      {
        id: 'rt-q1',
        questionKey: 'itHardwareQuiz.q.rt-q1',
        type: 'single',
        answers: [
          a('itHardwareQuiz.q.rt-a1-1', true),
          a('itHardwareQuiz.q.rt-a1-2', false),
          a('itHardwareQuiz.q.rt-a1-3', false),
          a('itHardwareQuiz.q.rt-a1-4', false),
          a('itHardwareQuiz.q.rt-a1-5', false),
        ],
      },
      {
        id: 'rt-q2',
        questionKey: 'itHardwareQuiz.q.rt-q2',
        type: 'single',
        answers: [
          a('itHardwareQuiz.q.rt-a2-1', true),
          a('itHardwareQuiz.q.rt-a2-2', false),
          a('itHardwareQuiz.q.rt-a2-3', false),
          a('itHardwareQuiz.q.rt-a2-4', false),
          a('itHardwareQuiz.q.rt-a2-5', false),
        ],
      },
    ],
  },
  {
    id: 'cpu',
    nameKey: 'itHardwareQuiz.hardware.cpu',
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Intel_pentium4_1.5ghz_willamette_socek423.jpg',
    emoji: '🧠',
    questions: [
      {
        id: 'cpu-q1',
        questionKey: 'itHardwareQuiz.q.cpu-q1',
        type: 'single',
        answers: [
          a('itHardwareQuiz.q.cpu-a1-1', true),
          a('itHardwareQuiz.q.cpu-a1-2', false),
          a('itHardwareQuiz.q.cpu-a1-3', false),
          a('itHardwareQuiz.q.cpu-a1-4', false),
          a('itHardwareQuiz.q.cpu-a1-5', false),
        ],
      },
      {
        id: 'cpu-q2',
        questionKey: 'itHardwareQuiz.q.cpu-q2',
        type: 'single',
        answers: [
          a('itHardwareQuiz.q.cpu-a2-1', true),
          a('itHardwareQuiz.q.cpu-a2-2', false),
          a('itHardwareQuiz.q.cpu-a2-3', false),
          a('itHardwareQuiz.q.cpu-a2-4', false),
          a('itHardwareQuiz.q.cpu-a2-5', false),
        ],
      },
      {
        id: 'cpu-q3',
        questionKey: 'itHardwareQuiz.q.cpu-q3',
        type: 'multiple',
        correctCount: 2,
        answers: [
          a('itHardwareQuiz.q.cpu-a3-1', true),
          a('itHardwareQuiz.q.cpu-a3-2', true),
          a('itHardwareQuiz.q.cpu-a3-3', false),
          a('itHardwareQuiz.q.cpu-a3-4', false),
          a('itHardwareQuiz.q.cpu-a3-5', false),
        ],
      },
    ],
  },
  {
    id: 'ram',
    nameKey: 'itHardwareQuiz.hardware.ram',
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/43/KVR400X64C3AK2_-_2G.jpg',
    emoji: '⚡',
    questions: [
      {
        id: 'ram-q1',
        questionKey: 'itHardwareQuiz.q.ram-q1',
        type: 'single',
        answers: [
          a('itHardwareQuiz.q.ram-a1-1', true),
          a('itHardwareQuiz.q.ram-a1-2', false),
          a('itHardwareQuiz.q.ram-a1-3', false),
          a('itHardwareQuiz.q.ram-a1-4', false),
          a('itHardwareQuiz.q.ram-a1-5', false),
        ],
      },
      {
        id: 'ram-q2',
        questionKey: 'itHardwareQuiz.q.ram-q2',
        type: 'single',
        answers: [
          a('itHardwareQuiz.q.ram-a2-1', true),
          a('itHardwareQuiz.q.ram-a2-2', false),
          a('itHardwareQuiz.q.ram-a2-3', false),
          a('itHardwareQuiz.q.ram-a2-4', false),
          a('itHardwareQuiz.q.ram-a2-5', false),
        ],
      },
      {
        id: 'ram-q3',
        questionKey: 'itHardwareQuiz.q.ram-q3',
        type: 'single',
        answers: [
          a('itHardwareQuiz.q.ram-a3-1', true),
          a('itHardwareQuiz.q.ram-a3-2', false),
          a('itHardwareQuiz.q.ram-a3-3', false),
          a('itHardwareQuiz.q.ram-a3-4', false),
          a('itHardwareQuiz.q.ram-a3-5', false),
        ],
      },
    ],
  },
  {
    id: 'gpu',
    nameKey: 'itHardwareQuiz.hardware.gpu',
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/45/EVGA_GeForce_GTX_590.jpg',
    emoji: '🎮',
    questions: [
      {
        id: 'gpu-q1',
        questionKey: 'itHardwareQuiz.q.gpu-q1',
        type: 'single',
        answers: [
          a('itHardwareQuiz.q.gpu-a1-1', true),
          a('itHardwareQuiz.q.gpu-a1-2', false),
          a('itHardwareQuiz.q.gpu-a1-3', false),
          a('itHardwareQuiz.q.gpu-a1-4', false),
          a('itHardwareQuiz.q.gpu-a1-5', false),
        ],
      },
      {
        id: 'gpu-q2',
        questionKey: 'itHardwareQuiz.q.gpu-q2',
        type: 'single',
        answers: [
          a('itHardwareQuiz.q.gpu-a2-1', true),
          a('itHardwareQuiz.q.gpu-a2-2', false),
          a('itHardwareQuiz.q.gpu-a2-3', false),
          a('itHardwareQuiz.q.gpu-a2-4', false),
          a('itHardwareQuiz.q.gpu-a2-5', false),
        ],
      },
    ],
  },
  {
    id: 'usb-stick',
    nameKey: 'itHardwareQuiz.hardware.usb-stick',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/USB_Stick_2_GB.jpg',
    emoji: '🔑',
    questions: [
      {
        id: 'usb-q1',
        questionKey: 'itHardwareQuiz.q.usb-q1',
        type: 'single',
        answers: [
          a('itHardwareQuiz.q.usb-a1-1', true),
          a('itHardwareQuiz.q.usb-a1-2', false),
          a('itHardwareQuiz.q.usb-a1-3', false),
          a('itHardwareQuiz.q.usb-a1-4', false),
          a('itHardwareQuiz.q.usb-a1-5', false),
        ],
      },
      {
        id: 'usb-q2',
        questionKey: 'itHardwareQuiz.q.usb-q2',
        type: 'single',
        answers: [
          a('itHardwareQuiz.q.usb-a2-1', true),
          a('itHardwareQuiz.q.usb-a2-2', false),
          a('itHardwareQuiz.q.usb-a2-3', false),
          a('itHardwareQuiz.q.usb-a2-4', false),
          a('itHardwareQuiz.q.usb-a2-5', false),
        ],
      },
    ],
  },
  {
    id: 'webcam',
    nameKey: 'itHardwareQuiz.hardware.webcam',
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Hp_web_camera_closeup.jpg',
    emoji: '📷',
    questions: [
      {
        id: 'wc-q1',
        questionKey: 'itHardwareQuiz.q.wc-q1',
        type: 'single',
        answers: [
          a('itHardwareQuiz.q.wc-a1-1', true),
          a('itHardwareQuiz.q.wc-a1-2', false),
          a('itHardwareQuiz.q.wc-a1-3', false),
          a('itHardwareQuiz.q.wc-a1-4', false),
          a('itHardwareQuiz.q.wc-a1-5', false),
        ],
      },
      {
        id: 'wc-q2',
        questionKey: 'itHardwareQuiz.q.wc-q2',
        type: 'multiple',
        correctCount: 2,
        answers: [
          a('itHardwareQuiz.q.wc-a2-1', true),
          a('itHardwareQuiz.q.wc-a2-2', true),
          a('itHardwareQuiz.q.wc-a2-3', false),
          a('itHardwareQuiz.q.wc-a2-4', false),
          a('itHardwareQuiz.q.wc-a2-5', false),
        ],
      },
    ],
  },
  {
    id: 'printer',
    nameKey: 'itHardwareQuiz.hardware.printer',
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Canon_S520_ink_jet_printer.jpg',
    emoji: '🖨️',
    questions: [
      {
        id: 'pr-q1',
        questionKey: 'itHardwareQuiz.q.pr-q1',
        type: 'single',
        answers: [
          a('itHardwareQuiz.q.pr-a1-1', true),
          a('itHardwareQuiz.q.pr-a1-2', false),
          a('itHardwareQuiz.q.pr-a1-3', false),
          a('itHardwareQuiz.q.pr-a1-4', false),
          a('itHardwareQuiz.q.pr-a1-5', false),
        ],
      },
      {
        id: 'pr-q2',
        questionKey: 'itHardwareQuiz.q.pr-q2',
        type: 'multiple',
        correctCount: 2,
        answers: [
          a('itHardwareQuiz.q.pr-a2-1', true),
          a('itHardwareQuiz.q.pr-a2-2', true),
          a('itHardwareQuiz.q.pr-a2-3', false),
          a('itHardwareQuiz.q.pr-a2-4', false),
          a('itHardwareQuiz.q.pr-a2-5', false),
        ],
      },
    ],
  },
  {
    id: 'headset',
    nameKey: 'itHardwareQuiz.hardware.headset',
    image: 'https://upload.wikimedia.org/wikipedia/commons/2/27/Plantronics_headset.jpg',
    emoji: '🎧',
    questions: [
      {
        id: 'hs-q1',
        questionKey: 'itHardwareQuiz.q.hs-q1',
        type: 'single',
        answers: [
          a('itHardwareQuiz.q.hs-a1-1', true),
          a('itHardwareQuiz.q.hs-a1-2', false),
          a('itHardwareQuiz.q.hs-a1-3', false),
          a('itHardwareQuiz.q.hs-a1-4', false),
          a('itHardwareQuiz.q.hs-a1-5', false),
        ],
      },
      {
        id: 'hs-q2',
        questionKey: 'itHardwareQuiz.q.hs-q2',
        type: 'single',
        answers: [
          a('itHardwareQuiz.q.hs-a2-1', true),
          a('itHardwareQuiz.q.hs-a2-2', false),
          a('itHardwareQuiz.q.hs-a2-3', false),
          a('itHardwareQuiz.q.hs-a2-4', false),
          a('itHardwareQuiz.q.hs-a2-5', false),
        ],
      },
    ],
  },
  {
    id: 'hdd',
    nameKey: 'itHardwareQuiz.hardware.hdd',
    image: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Western_Digital_WD2500BB_Hard_Disk_A.jpg',
    emoji: '💿',
    questions: [
      {
        id: 'hdd-q1',
        questionKey: 'itHardwareQuiz.q.hdd-q1',
        type: 'single',
        answers: [
          a('itHardwareQuiz.q.hdd-a1-1', true),
          a('itHardwareQuiz.q.hdd-a1-2', false),
          a('itHardwareQuiz.q.hdd-a1-3', false),
          a('itHardwareQuiz.q.hdd-a1-4', false),
          a('itHardwareQuiz.q.hdd-a1-5', false),
        ],
      },
      {
        id: 'hdd-q2',
        questionKey: 'itHardwareQuiz.q.hdd-q2',
        type: 'multiple',
        correctCount: 2,
        answers: [
          a('itHardwareQuiz.q.hdd-a2-1', true),
          a('itHardwareQuiz.q.hdd-a2-2', true),
          a('itHardwareQuiz.q.hdd-a2-3', false),
          a('itHardwareQuiz.q.hdd-a2-4', false),
          a('itHardwareQuiz.q.hdd-a2-5', false),
        ],
      },
      {
        id: 'hdd-q3',
        questionKey: 'itHardwareQuiz.q.hdd-q3',
        type: 'single',
        answers: [
          a('itHardwareQuiz.q.hdd-a3-1', true),
          a('itHardwareQuiz.q.hdd-a3-2', false),
          a('itHardwareQuiz.q.hdd-a3-3', false),
          a('itHardwareQuiz.q.hdd-a3-4', false),
          a('itHardwareQuiz.q.hdd-a3-5', false),
        ],
      },
    ],
  },
  {
    id: 'speaker',
    nameKey: 'itHardwareQuiz.hardware.speaker',
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Kompakt_Lautsprecher_Boxen.jpg',
    emoji: '🔊',
    questions: [
      {
        id: 'sp-q1',
        questionKey: 'itHardwareQuiz.q.sp-q1',
        type: 'single',
        answers: [
          a('itHardwareQuiz.q.sp-a1-1', true),
          a('itHardwareQuiz.q.sp-a1-2', false),
          a('itHardwareQuiz.q.sp-a1-3', false),
          a('itHardwareQuiz.q.sp-a1-4', false),
          a('itHardwareQuiz.q.sp-a1-5', false),
        ],
      },
      {
        id: 'sp-q2',
        questionKey: 'itHardwareQuiz.q.sp-q2',
        type: 'single',
        answers: [
          a('itHardwareQuiz.q.sp-a2-1', true),
          a('itHardwareQuiz.q.sp-a2-2', false),
          a('itHardwareQuiz.q.sp-a2-3', false),
          a('itHardwareQuiz.q.sp-a2-4', false),
          a('itHardwareQuiz.q.sp-a2-5', false),
        ],
      },
    ],
  },
]

const QUESTIONS_PER_SESSION = 10

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export interface SessionQuestion {
  hardware: HardwareItem
  question: ReturnType<typeof buildSessionQuestion>
}

function buildSessionQuestion(q: HardwareItem['questions'][0]) {
  return {
    ...q,
    answers: shuffle(q.answers),
  }
}

/** Build a session of QUESTIONS_PER_SESSION questions, picking one random question per hardware item first, then repeating if more are needed. */
export function buildSession(): SessionQuestion[] {
  // Collect all (hardware, question) pairs
  const pool: { hardware: HardwareItem; question: HardwareItem['questions'][0] }[] = []
  for (const hw of HARDWARE_ITEMS) {
    for (const q of hw.questions) {
      pool.push({ hardware: hw, question: q })
    }
  }

  const shuffled = shuffle(pool)
  // Pick up to QUESTIONS_PER_SESSION unique hardware items first, then fill remaining slots
  const selected: typeof shuffled = []
  const usedHwIds = new Set<string>()

  // First pass: one per hardware item
  for (const entry of shuffled) {
    if (selected.length >= QUESTIONS_PER_SESSION) break
    if (!usedHwIds.has(entry.hardware.id)) {
      usedHwIds.add(entry.hardware.id)
      selected.push(entry)
    }
  }

  // Second pass: fill remaining with any remaining questions
  if (selected.length < QUESTIONS_PER_SESSION) {
    for (const entry of shuffled) {
      if (selected.length >= QUESTIONS_PER_SESSION) break
      if (!selected.includes(entry)) {
        selected.push(entry)
      }
    }
  }

  return selected.map(({ hardware, question }) => ({
    hardware,
    question: buildSessionQuestion(question),
  }))
}
