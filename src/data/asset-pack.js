export default
    {
        'sprites': {
            'player': {
                'url': '/static/assets/wizard.png',
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
            'projectile': {},
            'enemy': {
                'hyena': {
                    'url': '/static/pics/hyena.png',
                    'frameWidth': 0,
                    'frameHeight': 0,
                    'animations': {
                    }
                }
            },
            'perk': {
                'url': '/static/assets/perk.png',
                'frameWidth': 24,
                'frameHeight': 24,
                'position': [
                    { 'x': 0.40, 'y': 0.25 },
                    { 'x': 0.05, 'y': 0.45 },
                    { 'x': 0.93, 'y': 0.40 },
                    { 'x': 0.55, 'y': 0.80 },
                    { 'x': 0.04, 'y': 0.80 },
                    { 'x': 0.90, 'y': 0.75 },
                ],
                'variety': [
                    { 'name': 'BS', 'text': 'Bonus Heart +1', 'color': '#c83232' },
                    { 'name': 'JB', 'text': 'Jump Boost \nIncrease +0.2', 'color': '#00fa6c' },
                    { 'name': 'MS', 'text': 'Movement Speed \nIncrease +0.2', 'color': '#7f4cc7' },
                    { 'name': 'FR', 'text': 'FireRate \nIncrease -0.2', 'color': '#ff8300' },
                    { 'name': 'MANA', 'text': 'Mana \nIncrease +1', 'color': '#00ffff' },
                ],
                'animations': {
                    'BS': { 'loc': [{ 'x': 0, 'y': 0 }, { 'x': 24, 'y': 0 }, { 'x': 48, 'y': 0 }, { 'x': 72, 'y': 0 }] },
                    'JB': { 'loc': [{ 'x': 0, 'y': 24 }, { 'x': 24, 'y': 24 }, { 'x': 48, 'y': 24 }, { 'x': 72, 'y': 24 }] },
                    'MS': { 'loc': [{ 'x': 0, 'y': 48 }, { 'x': 24, 'y': 48 }, { 'x': 48, 'y': 48 }, { 'x': 72, 'y': 48 }] },
                    'FR': { 'loc': [{ 'x': 0, 'y': 72 }, { 'x': 24, 'y': 72 }, { 'x': 48, 'y': 72 }, { 'x': 72, 'y': 72 }] },
                    'MANA': { 'loc': [{ 'x': 0, 'y': 96 }, { 'x': 24, 'y': 96 }, { 'x': 48, 'y': 96 }, { 'x': 72, 'y': 96 }] },
                }
            },
            'tileset': {
                'url': '/static/assets/tileset.png',
                'frameWidth': 48,
                'frameHeight': 48,
                'columns': 18,
                'ignoreFrame': [],
                'painfulFrame': [],
                // 'painfulFrame': [123, 144, 145, 146, 166, 167, 183, 184, 185],
                'map': [
                    4, 1, 2, 3, 4, 5, 6, 21, 8, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 6, 21, 8, 5, 4, 1, 2,
                    18, 19, 20, 21, 22, 23, 24, 173, 26, 27, 28, 29, 21, 19, 19, 21, 20, 19, 22, 23, 24, 173, 26, 27, 28, 29, 30,
                    36, 37, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, 47, 48,
                    54, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, 66,
                    54, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, 66,
                    54, false, false, false, false, false, false, 144, 145, 145, 145, 145, 145, 145, 146, false, false, false, false, false, false, false, false, false, false, false, 66,
                    54, false, false, false, false, false, false, 180, 181, 163, 181, 163, 163, 181, 182, false, false, false, false, false, false, false, false, false, false, false, 66,
                    54, false, false, false, false, false, false, 173, 173, 173, 173, 173, 173, 173, 173, false, false, false, false, false, false, false, false, false, false, 123, 66,
                    54, 166, 167, false, false, false, false, false, false, false, false, false, false, false, false, false, false, 144, 145, 146, false, false, false, false, false, false, 66,
                    54, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, 162, 181, 164, false, false, false, false, false, false, 66,
                    54, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, 162, 163, 164, false, false, false, false, false, false, 66,
                    54, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, 162, 163, 164, false, false, false, false, false, false, 66,
                    72, false, 183, 184, 185, false, false, false, false, false, false, false, false, false, false, false, false, 180, 181, 182, false, false, false, 183, 184, 145, 84,
                    90, 91, 91, 91, 91, 92, 93, 91, 92, 110, 91, 91, 91, 91, 111, 93, 91, 92, 93, 91, 91, 91, 91, 91, 91, 91, 102,
                    112, 113, 113, 113, 113, 114, 112, 113, 114, 117, 113, 113, 113, 113, 118, 112, 113, 114, 112, 113, 113, 113, 113, 113, 113, 113, 118,

                ]
            },
        }
    };