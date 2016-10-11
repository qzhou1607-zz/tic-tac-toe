/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
APP = {
    score1:0,
    score2:0,
    currentPlayer:0,
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
    //align boxes 
    initializeBoxes:function() {
        var self = this;
        $('.boxes').empty();
        for(var i = 1; i <= 9; i++) {
            $('<li id=' + i + '></li>').appendTo($('.boxes'));
        }
    },
    getRightAlert: function() {
        var self = this;
        if(self.currentPlayer === 1) {
            self.promptAlert('player-one-alert');
            self.hideAlert('player-two-alert');
        } else {
            self.promptAlert('player-two-alert');
            self.hideAlert('player-one-alert');
        }
    },
    promptAlert:function(alertClass) {
        $('.' + alertClass).animate({top:'-50px'});
    },
    hideAlert:function(alertClass) {
        $('.' + alertClass).animate({top:'0px'});
    },
    updateScore: function() {
        var self = this;
        $('.score-1 .points').text(self.score1);
        $('.score-2 .points').text(self.score2);
    },
    showMessage: function(player,type) {
        if (type === 'win') {
            $('.win-message').text('Player ' + player + ' won!');
            $('.win-message').fadeIn();
        } else if (type === 'lose') {
            $('.lose-message').fadeIn();
        } else {
            $('.equal-message').fadeIn();
        }
    },
    hideMessage: function(type) {
        if (type === 'win') {
            $('.win-message').fadeOut();
        } else if (type === 'lose') {
            $('.lose-message').fadeOut();
        } else {
            $('.equal-message').fadeOut();
        }
    },
    //get random turn
    getTurn: function() {
        return Math.floor(Math.random()*2 + 1);
    },
    //update boxes on click, check for winner, and switch turns
    play:function() {
        var self = this;
        $('.boxes li').on('click',function() {
            if ($(this).html() != '') { //prevent double click
                return;
            }
            var id = $(this).attr('id');
            var marker = self.firstPlayerMarker;
            if(self.currentPlayer == 2) {
                marker = self.secondPlayerMarker;
            }
            
            $(this).html(marker);//update box
            self.record[id] = marker;//update record
            self.filledNumber += 1;
            
            
            //check win
            if (self.checkWin(marker) != false) { //win!
                //alert('win!');
                console.log(self.checkWin(marker));
                self.showWinCombo(self.checkWin(marker));
                self.showMessage(self.currentPlayer,'win');
                if (self.currentPlayer === 1) {
                    self.score1 += 1;
                } else {
                    self.score2 += 1;
                }
                self.updateScore();
                setTimeout(function() {
                    self.restartGame(); //start a new round
                },4000);
                setTimeout(function() {
                    self.hideMessage('win');
                },4000);
                
            } else {
                if (self.filledNumber >= 9) { //it's a draw
                    self.showMessage(self.currentPlayer,'draw');
                    setTimeout(function() {
                        self.restartGame(); //start a new round
                    },4000);
                    setTimeout(function() {
                        self.hideMessage('draw');
                    },4000);
                    return;
                }
                self.currentPlayer = 3 - self.currentPlayer;//take turns
                self.getRightAlert();
                if (!self.secondPlayer && self.currentPlayer === 2) {
                    setTimeout(function() {
                        self.computerPlay();
                    }, 1000);
                }
            }
        });
    },
    bestComputerMove:function() {
        var self = this;
        var combinations = self.winCombos;
        //To win
        for (var i = 0; i < combinations.length; i++) {
            var filled = [];
            var empty = [];
            var combination = combinations[i];
            for (var j = 0; j < combination.length; j++) {
                if (self.record[combination[j]] === self.secondPlayerMarker) {
                    filled.push(combination[j]);
                }
                if (self.record[combination[j]] === '') {
                    empty.push(combination[j]);
                }
            }
            
            if (filled.length === 2 && empty.length === 1) {
                return empty[0];
            } 
        }
        //To block
        for (var i = 0; i < combinations.length; i++) {
            var filled = [];
            var empty = [];
            var combination = combinations[i];
            for (var j = 0; j < combination.length; j++) {
                if (self.record[combination[j]] === self.firstPlayerMarker) {
                    filled.push(combination[j]);
                }
                if (self.record[combination[j]] === '') {
                    empty.push(combination[j]);
                }
            }
            
            if (filled.length === 2 && empty.length === 1) {
                return empty[0];
            } 
        }
        return false;
    },
    computerPlay:function() {
        self = this;
        var move;
        if (self.bestComputerMove() != false) {
            move = self.bestComputerMove();
        } else {
            for(var field in self.record) {
                if (self.record[field] === '') {
                    move = field;
                    break;
                }
            }
        }
        console.log(move);
        $('#' + move).trigger('click');
    },
    checkWin: function(marker) {
        var self = this;
        var combinations = self.winCombos;
        for (var i = 0; i < combinations.length; i++) {
            var win = true;
            var combination = combinations[i];
            
            for (var j = 0; j < combination.length; j++) {
                if (self.record[combination[j]] != marker) {
                    win = false;
                } 
            }
            console.log(win);
            if(win === true) {
                return combination;
            }
        }
        return false;
    },
    showWinCombo: function(combo) {
        for (var i = 0; i < combo.length; i++) {
            $('#'  + combo[i]).addClass('win');
        }
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
            self.getRightAlert();
        }); 
        self.currentPlayer = self.getTurn(); //get a random player
        self.initializeBoxes();
        self.play();
//        if (!self.secondPlayer && self.currentPlayer === 2) {
//            setTimeout(function() {
//                self.computerPlay();
//            }, 1000);
//        }
    },
    //not change setting, but restart a new round
    restartGame: function() {
        self = this;
        self.hideAlert('player-one-alert');
        self.hideAlert('player-two-alert');
        self.currentPlayer = self.getTurn(); //get a random player
        self.initializeRecord();
        self.initializeBoxes();
        self.getRightAlert();
        self.play();
    }
}

$(document).ready(function() {
    APP.initializeGame();
});

