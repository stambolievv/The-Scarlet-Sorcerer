export default
  {
    'gui': {
      'hud': {
        'src': 'assets/images/gui/hud_bg.png',
        'width': 273,
        'height': 74,
      },
      'healthBar': {
        'src': 'assets/images/gui/hp_bar.png',
        'width': 185,
        'height': 24,
      },
      'bonusBar': {
        'src': 'assets/images/gui/bonus_hp_bar.png',
        'width': 185,
        'height': 24,
      },
      'manaBar': {
        'src': 'assets/images/gui/mana_bar.png',
        'width': 205,
        'height': 12,
      },
      'oxygenBar': {
        'src': 'assets/images/gui/oxygen_bar.png',
        'width': 180,
        'height': 11,
      },
      'stats': {
        'src': 'assets/images/gui/stats.png',
        'width': 320,
        'height': 64,
      },
      'restart': {
        'src': 'assets/images/gui/restart_icon.png',
        'width': 128,
        'height': 128,
      },
      'resume': {
        'src': 'assets/images/gui/resume_icon.png',
        'width': 128,
        'height': 128,
      },
      'pause': {
        'src': 'assets/images/gui/pause_icon.png',
        'width': 48,
        'height': 48,
      },
      'mute': {
        'src': 'assets/images/gui/mute_icon.png',
        'width': 32,
        'height': 32,
      },
      'debug': {
        'src': 'assets/images/gui/debug_icon.png',
        'width': 32,
        'height': 32,
      },
      'fps': {
        'src': 'assets/images/gui/fps_icon.png',
        'width': 32,
        'height': 32,
      },
      'info': {
        'src': 'assets/images/gui/info_icon.png',
        'width': 32,
        'height': 32,
      },
      'power': {
        'src': 'assets/images/gui/power_icon.png',
        'width': 32,
        'height': 32,
      }
    },
    'background': {
      'layer1': {
        'src': 'assets/images/layers/1.png',
        'width': 1296,
        'height': 720,
        'moving': false
      },
      'layer2': {
        'src': 'assets/images/layers/2.png',
        'width': 1296,
        'height': 720,
        'moving': false
      },
      'layer3': {
        'src': 'assets/images/layers/3.png',
        'width': 1296,
        'height': 720,
        'moving': false
      },
      'layer4': {
        'src': 'assets/images/layers/4.png',
        'width': 1920,
        'height': 720,
        'moving': true
      }
    },
    'spritesheets': {
      'tileset': {
        'src': 'assets/images/tileset.png',
        'frameWidth': 48,
        'frameHeight': 48,
        'columns': 18,
        'ignoreFrame': [-1],
        'decorationFrame': [37, 47, 73, 83, 169, 170, 171, 172, 173, 174, 175, 176, 189, 190, 191, 192, 193, 194, 209, 210],
        'painfulFrame': [123, 144, 145, 146, 166, 167, 183, 184, 185],
        'map': [               
          4,    1,    2,    3,    4,    5,    6,    21,   8,    1,    2,    3,    4,    5,    1,    2,    3,    4,    5,    1,    6,    21,   8,    5,    4,    2,    0,
          18,   19,   20,   21,   22,   23,   24,   174,  26,   27,   28,   29,   21,   19,   19,   21,   20,   19,   22,   23,   24,   174,  26,   27,   28,   7,    30,
          36,   175,  -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   210,  -1,   -1,   -1,   -1,   -1,   -1,   -1,   47,   48,
          54,   193,  -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   172,  -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   66,
          54,   188,  -1,   -1,   -1,   -1,   -1,   189,  -1,   -1,   -1,   -1,   -1,   189,  -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   66,
          54,   -1,   -1,   -1,   -1,   -1,   -1,   144,  145,  145,  145,  145,  145,  146,  -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   66,
          54,   -1,   -1,   -1,   -1,   -1,   -1,   180,  163,  163,  163,  163,  163,  182,  -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   83,   66,
          54,   -1,   -1,   -1,   -1,   -1,   -1,   174,  173,  173,  173,  173,  173,  174,  -1,   -1,   -1,   171,  171,  171,  -1,   -1,   -1,   -1,   -1,   123,  66,
          54,   187,  188,  -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   144,  184,  146,  -1,   -1,   -1,   -1,   -1,   -1,   66,
          54,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   162,  163,  164,  -1,   -1,   -1,   -1,   -1,   -1,   66,
          54,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   162,  163,  164,  -1,   -1,   -1,   -1,   -1,   -1,   66,
          54,   -1,   191,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   162,  163,  164,  -1,   -1,   -1,   -1,   -1,   190,  66,
          72,   73,   183,  184,  185,  -1,   -1,   -1,   -1,   -1,   192,  -1,   -1,   -1,   -1,   -1,   -1,   180,  163,  182,  194,  -1,   -1,   183,  184,  185,  84,
          90,   91,   91,   91,   92,   93,   91,   92,   110,  91,   91,   91,   91,   91,   91,   111,  93,   91,   92,   93,   91,   91,   91,   91,   91,   91,   102,
          112,  113,  113,  113,  114,  112,  113,  114,  117,  113,  113,  113,  113,  113,  113,  118,  112,  113,  114,  112,  113,  113,  113,  113,  113,  113,  114
        ]
      },
      'player': {
        'src': 'assets/images/wizard.png',
        'frameWidth': 166,
        'frameHeight': 136,
        'animations': {
          'ultimateLeft': { 'loc': [{ 'x': 0, 'y': 0 }, { 'x': 166, 'y': 0 }, { 'x': 332, 'y': 0 }, { 'x': 498, 'y': 0 }, { 'x': 664, 'y': 0 }, { 'x': 830, 'y': 0 }, { 'x': 996, 'y': 0 }, { 'x': 1162, 'y': 0 }] },
          'ultimateRight': { 'loc': [{ 'x': 0, 'y': 136 }, { 'x': 166, 'y': 136 }, { 'x': 332, 'y': 136 }, { 'x': 498, 'y': 136 }, { 'x': 664, 'y': 136 }, { 'x': 830, 'y': 136 }, { 'x': 996, 'y': 136 }, { 'x': 1162, 'y': 136 }] },
          'attackLeft': { 'loc': [{ 'x': 0, 'y': 272 }, { 'x': 166, 'y': 272 }, { 'x': 332, 'y': 272 }, { 'x': 498, 'y': 272 }, { 'x': 664, 'y': 272 }, { 'x': 830, 'y': 272 }, { 'x': 996, 'y': 272 }, { 'x': 1162, 'y': 272 }] },
          'attackRight': { 'loc': [{ 'x': 0, 'y': 408 }, { 'x': 166, 'y': 408 }, { 'x': 332, 'y': 408 }, { 'x': 498, 'y': 408 }, { 'x': 664, 'y': 408 }, { 'x': 830, 'y': 408 }, { 'x': 996, 'y': 408 }, { 'x': 1162, 'y': 408 }] },
          'deathLeft': { 'loc': [{ 'x': 0, 'y': 544 }, { 'x': 166, 'y': 544 }, { 'x': 332, 'y': 544 }, { 'x': 498, 'y': 544 }, { 'x': 664, 'y': 544 }, { 'x': 830, 'y': 544 }, { 'x': 996, 'y': 544 }] },
          'deathRight': { 'loc': [{ 'x': 0, 'y': 680 }, { 'x': 166, 'y': 680 }, { 'x': 332, 'y': 680 }, { 'x': 498, 'y': 680 }, { 'x': 664, 'y': 680 }, { 'x': 830, 'y': 680 }, { 'x': 996, 'y': 680 }] },
          'fallLeft': { 'loc': [{ 'x': 0, 'y': 816 }, { 'x': 166, 'y': 816 }] },
          'fallRight': { 'loc': [{ 'x': 0, 'y': 952 }, { 'x': 166, 'y': 952 }] },
          'hitLeft': { 'loc': [{ 'x': 0, 'y': 1088 }, { 'x': 166, 'y': 1088 }, { 'x': 332, 'y': 1088 }, { 'x': 498, 'y': 1088 }] },
          'hitRight': { 'loc': [{ 'x': 0, 'y': 1224 }, { 'x': 166, 'y': 1224 }, { 'x': 332, 'y': 1224 }, { 'x': 498, 'y': 1224 }] },
          'idleLeft': { 'loc': [{ 'x': 0, 'y': 1360 }, { 'x': 166, 'y': 1360 }, { 'x': 332, 'y': 1360 }, { 'x': 498, 'y': 1360 }, { 'x': 664, 'y': 1360 }, { 'x': 830, 'y': 1360 }] },
          'idleRight': { 'loc': [{ 'x': 0, 'y': 1496 }, { 'x': 166, 'y': 1496 }, { 'x': 332, 'y': 1496 }, { 'x': 498, 'y': 1496 }, { 'x': 664, 'y': 1496 }, { 'x': 830, 'y': 1496 }] },
          'jumpLeft': { 'loc': [{ 'x': 0, 'y': 1632 }, { 'x': 166, 'y': 1632 }] },
          'jumpRight': { 'loc': [{ 'x': 0, 'y': 1768 }, { 'x': 166, 'y': 1768 }] },
          'runLeft': { 'loc': [{ 'x': 0, 'y': 1904 }, { 'x': 166, 'y': 1904 }, { 'x': 332, 'y': 1904 }, { 'x': 498, 'y': 1904 }, { 'x': 664, 'y': 1904 }, { 'x': 830, 'y': 1904 }, { 'x': 996, 'y': 1904 }, { 'x': 1162, 'y': 1904 }] },
          'runRight': { 'loc': [{ 'x': 0, 'y': 2040 }, { 'x': 166, 'y': 2040 }, { 'x': 332, 'y': 2040 }, { 'x': 498, 'y': 2040 }, { 'x': 664, 'y': 2040 }, { 'x': 830, 'y': 2040 }, { 'x': 996, 'y': 2040 }, { 'x': 1162, 'y': 2040 }] },
        }
      },
      'projectile': {
        'src': 'assets/images/fireball.png',
        'frameWidth': 17,
        'frameHeight': 34,
        'animations': {
          'projectile': { 'loc': [{ 'x': 0, 'y': 0 }, { 'x': 17, 'y': 0 }, { 'x': 34, 'y': 0 }, { 'x': 51, 'y': 0 }, { 'x': 68, 'y': 0 }] },
        }
      },
      'perk': {
        'src': 'assets/images/perk.png',
        'frameWidth': 24,
        'frameHeight': 24,
        'position': [
          { 'x': 0.40, 'y': 0.26 },
          { 'x': 0.05, 'y': 0.46 },
          { 'x': 0.93, 'y': 0.40 },
          { 'x': 0.55, 'y': 0.80 },
          { 'x': 0.05, 'y': 0.80 },
          { 'x': 0.90, 'y': 0.73 },
        ],
        'variety': [
          { 'name': 'BS', 'text': 'Bonus Heart +1', 'color': '#c83232' },
          { 'name': 'JB', 'text': 'Jump Boost \nIncrease +0.2', 'color': '#00fa6c' },
          { 'name': 'MS', 'text': 'Movement Speed \nIncrease +0.2', 'color': '#7f4cc7' },
          { 'name': 'FR', 'text': 'FireRate \nIncrease -0.2', 'color': '#ff8300' },
          { 'name': 'MANA', 'text': 'Mana Regeneration \nIncrease +1', 'color': '#00ffff' },
        ],
        'animations': {
          'BS': { 'loc': [{ 'x': 0, 'y': 0 }, { 'x': 24, 'y': 0 }, { 'x': 48, 'y': 0 }, { 'x': 72, 'y': 0 }] },
          'JB': { 'loc': [{ 'x': 0, 'y': 24 }, { 'x': 24, 'y': 24 }, { 'x': 48, 'y': 24 }, { 'x': 72, 'y': 24 }] },
          'MS': { 'loc': [{ 'x': 0, 'y': 48 }, { 'x': 24, 'y': 48 }, { 'x': 48, 'y': 48 }, { 'x': 72, 'y': 48 }] },
          'FR': { 'loc': [{ 'x': 0, 'y': 72 }, { 'x': 24, 'y': 72 }, { 'x': 48, 'y': 72 }, { 'x': 72, 'y': 72 }] },
          'MANA': { 'loc': [{ 'x': 0, 'y': 96 }, { 'x': 24, 'y': 96 }, { 'x': 48, 'y': 96 }, { 'x': 72, 'y': 96 }] },
        }
      },
      'bat': {
        'src': 'assets/images/bat.png',
        'frameWidth': 64,
        'frameHeight': 64,
        'pointsForDeath': 10,
        'animations': {
          'batLeft': { 'loc': [{ 'x': 0, 'y': 0 }, { 'x': 64, 'y': 0 }, { 'x': 128, 'y': 0 }] },
          'batRight': { 'loc': [{ 'x': 0, 'y': 64 }, { 'x': 64, 'y': 64 }, { 'x': 128, 'y': 64 }] },
        }
      },
      'skeleton': {
        'src': 'assets/images/skeleton.png',
        'frameWidth': 32,
        'frameHeight': 32,
        'pointsForDeath': 20,
        'animations': {
          'skeletonLeft': { 'loc': [{ 'x': 0, 'y': 0 }, { 'x': 32, 'y': 0 }, { 'x': 64, 'y': 0 }] },
          'skeletonRight': { 'loc': [{ 'x': 0, 'y': 32 }, { 'x': 32, 'y': 32 }, { 'x': 64, 'y': 32 }] },
        }
      },
      'saw': {
        'src': 'assets/images/saw.png',
        'frameWidth': 50,
        'frameHeight': 50,
        'pointsForDeath': 0,
        'animations': {
          'sawLeft': { 'loc': [{ 'x': 0, 'y': 0 }, { 'x': 50, 'y': 0 }, { 'x': 100, 'y': 0 }] },
          'sawRight': { 'loc': [{ 'x': 0, 'y': 50 }, { 'x': 50, 'y': 50 }, { 'x': 100, 'y': 50 }] },
        }
      }
    },
    'audio': {
      'background': {
        'src': 'assets/audio/background.wav',
        'loop': true
      },
      'gameover': {
        'src': 'assets/audio/gameover.wav',
        'loop': false
      },
      'enemyKill': {
        'src': 'assets/audio/enemyKill.wav',
        'loop': false
      },
      'collect': {
        'src': 'assets/audio/collect.wav',
        'loop': false
      },
      'oxygen': {
        'src': 'assets/audio/oxygen.wav',
        'loop': false
      },
      'projectile': {
        'src': 'assets/audio/projectile.wav',
        'loop': false
      },
      'footsteps': {
        'src': 'assets/audio/footsteps.wav',
        'loop': false
      },
      'click': {
        'src': 'assets/audio/click.wav',
        'loop': false
      }
    }
  };