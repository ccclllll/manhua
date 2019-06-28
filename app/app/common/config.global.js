export default globalConfig = {
    statusBar:{
        hidden: false,
        translucent: true,
        backgroundColor: 'transparent',
        animated: true,
        barStyle: 'light-content'
    },
    statusBar_book:{
        hidden: false,
        backgroundColor: 'rgb(51,133,255)',
        animated: true,
        barStyle: 'light-content'
    },
    statusBar_read:{
        hidden: false,
        animated: true,
        translucent: true,
    },
    statusFull:{
        hidden: false,
        translucent: false,
        backgroundColor: 'rgb(0,0,0)',
        animated: true,
        barStyle: 'rgb(252,208,0)'
    },
    statusBarChapter:{
        hidden: false,
        animated: true,
        translucent: false,
        backgroundColor: 'rgb(51,133,255)',
        barStyle: 'rgb(252,208,0)'
    },
    BASEURL: 'http://47.100.166.151:8080/',
    // BASEURL: 'http://172.30.70.112:8080/',
    BASE_URL_BN : '',
    BASE_URL_MHN : '',
    bookReadConfig:{
        backgroundStyles:{
            default:{
                backgroundColor:'#c9e0ef',
                color: '#333',
                text:'默认'
            }, tea:{
                backgroundColor:'rgb(210,140,180)',
                color: '#333',
                text: '茶色'
            },
            mise:{
                backgroundColor:'rgb(245,245,220)',
                color: '#333',
                text: '米色'
            },
            baixue:{
                backgroundColor: 'rgb(255, 255, 255)',
                color: '#333',
                text: '白雪'
            },
            night:{
                backgroundColor: 'rgb(17, 17, 17)',
                color: 'rgb(153, 153, 153)',
                text: '夜间'
            }
        },
        fontSizeStyles:{
                endCountFontSize: 15,
                authorFontSize: 16,
                contentFontSize: 18,
                titleFontSize: 33,
            },
        bgStyles:[
            { title: '羊皮纸', bgColor: '#e5dfce' },
            { title: '淡雅白', bgColor: '#f6f4f0' },
            { title: '冰爽蓝', bgColor: '#c9e0ef' },
            { title: '浪漫粉', bgColor: '#e0b7c4' },
            { title: '护眼绿', bgColor: '#a5bd9c' }
        ],
    }
}