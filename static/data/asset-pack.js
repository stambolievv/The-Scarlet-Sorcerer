export default
    {
        'sprites': {
            'player': {
                'url': '/static/pics/player.png',
                'frameWidth': 1371 / 25, // width ÷ columns  //54.92
                'frameHeight': 80 / 1 // height ÷ rows
            },
            'enemy': {
                'hyena': {
                    'url': '/static/pics/hyena.png',
                    'frameWidth': 270 / 6, // width ÷ columns
                    'frameHeight': 54 / 2, // height ÷ rows
                    'animations': {
                        'runL': {
                            loc: [
                                { x: 0, y: 0 },
                                { x: 45, y: 0 },
                                { x: 90, y: 0 },
                                { x: 135, y: 0 },
                                { x: 180, y: 0 }
                            ]
                        },
                        'runR': {
                            loc: [
                                { x: 0, y: 27 },
                                { x: 45, y: 27 },
                                { x: 90, y: 27 },
                                { x: 135, y: 27 },
                                { x: 180, y: 27 }
                            ]
                        },
                    }
                }
            },
            'platform': {},
            'perk': {},
            'projectile': {}
        },
        'tileMap': []
    };