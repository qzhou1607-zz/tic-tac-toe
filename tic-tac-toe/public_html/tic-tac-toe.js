/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
APP = {
    score1:0,
    score2:0,
    secondPlayer: false,
    firstPlayerMarker:'',
    secondPlayerMarker:'',
    winCombos:[
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
        [1, 5, 9],
        [7, 5, 3]  
    ],
    initializeRecord: function() {
        this.filledNumber = 0;
        this.record = {
            1:'',
            2:'',
            3:'',
            4:'',
            5:'',
            6:'',
            7:'',
            8:'',
            9:''
        }
    }
}

