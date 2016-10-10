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
    },
    //check player setting
    hasSecondPlayer: function(choice) {
        if($(choice).text() === 'One Player') {
            return false;
        }
        return true;
    },
    setMarker: function(choice) {
        var self = this;
        if ($(choice).text() === 'X') {
            self.firstPlayerMarker = 'X';
            self.secondPlayerMarker = 'O';
        } else {
            self.firstPlayerMarker = 'O';
            self.secondPlayerMarker = 'X';
        }
    },
    //draw line on canvas
    drawline:function(canvas,startX,startY,endX,endY) {
        canvas.lineWidth = '1';
        canvas.strokeStyle = '#FFF';
        canvas.beginPath();
        canvas.moveTo(startX, startY);
        canvas.lineTo(endX, endY);
        canvas.closePath();
        canvas.stroke();
    },
    drawboard: function() {
        var c = document.getElementById('my-canvas');
        var canvas = c.getContext('2d');
        
        this.drawline(canvas,100,0,100,146.5);
        this.drawline(canvas,200,0,200,146.5);
        this.drawline(canvas,4,48.5,296,48.5);
        this.drawline(canvas,4,98.5,296,98.5);
    },
    initializeGame: function() {
        var self = this;
        self.initializeRecord();
        //save player setting
        $('.player-choice button').on('click', function() {
            self.secondPlayer = self.hasSecondPlayer(this);
            //hide player setting
            $('.player-choice').hide();
            //show marker setting
            $('.marker-choice').fadeIn();
        });
        $('.marker-choice button').on('click', function() {
            //save marker setting
            self.setMarker(this); 
            $('.settings').hide();
            self.drawboard();
        });  
        
    },
}

$(document).ready(function() {
    APP.initializeGame();
});

