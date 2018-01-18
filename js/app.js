var Pomodoro = function(pomodoroTime, breakTime, displayElementID, msgDisplayID) {
	this.cycle = pomodoroTime * 60;	   // Pomodoro cycle in seconds. (We pass in minutes).
	this.break = breakTime * 60;		   // Break cycle in seconds.(We pass in minutes).
	this.state = 0;									   // Initial state.
	this.lastState = 2;							   // This additional property will be useful
																	   // if we pause and want to go back to a break or pomodoro state.
																	   // We set it to a pomodoro cycle state,
																	   // since it will be the first that will run every time.
	this.timeLeft = pomodoroTime * 60; // Time left is initialized to be the same as a pomodoro cycle.
	this.timerDisplay = displayElementID;	// ID of the DOM element where we want the time to be updated in.
	this.msgDisplay = msgDisplayID;				// ID of the DOM element where we want to display messages for the user.
};

Pomodoro.prototype.start = function() {
	var self = this;
	// console.log('self from Pomodoro.start: ', self);
	if (this.state === 0 || this.state === 1) {
		this.newState(this.lastState === 2 ? 2 : 3);
		// tick - ketyeg
		tick();
		this.timer = setInterval(function() {
			tick();
		}, 1000);
	}

	function tick() {
		// console.log('this from tick: ', this);
		self.timeLeft = self.timeLeft - 1;	// Decrease the cycle time by one.
		self.updateDisplay(self.timeLeft);	// Update the display div.
		if (self.timeLeft === 0) {					// If time reaches zero, we start a pomodoro cycle or break cycle depending on the current state.
			self.timeLeft = self.state === 2 ? self.break : self.cycle;	// We reset the timeLeft property to the next cycle.
			self.newState(self.state === 2 ? 3 : 2); // We change the state to the next cycle.
		}
	}
};

Pomodoro.prototype.pause = function() {
	if (this.state === 2 || this.state === 3) {
		this.newState(1);
		clearInterval(this.timer);
	}
};

Pomodoro.prototype.reset = function() {
	this.newState(0);
	this.timeLeft = this.cycle;
	clearInterval(this.timer);
	this.updateDisplay(this.timeLeft);
};

Pomodoro.prototype.updateDisplay = function(time, message) {
	document.getElementById(this.timerDisplay).innerText = getFormattedTime(time);
	if (message) {
		document.getElementById(this.msgDisplay).innerText = message;
	}

	function getFormattedTime(seconds) {
		var minsLeft = Math.floor(seconds / 60),
				secondsLeft = seconds - (minsLeft * 60);

		function zeroPad(number) {
			return number < 10 ? '0' + number : number;
		}

		return zeroPad(minsLeft) + ':' + zeroPad(secondsLeft);
	}
};

Pomodoro.prototype.updateTimes = function(cycleTime, breakTime) {
	this.cycle = cycleTime * 60;
	this.break = breakTime * 60;
	// this.reset();
};

Pomodoro.prototype.newState = function(state) {
	this.lastState = this.state;
	this.state = state;
	var message,
			audioFile;

	switch (state) {
		case 0: // If state is 0, set lastState to 2 and set message content and color.
			this.lastState = 2;
			console.info('New state set: Initial state.');
			message = 'Click on play to start!';
			document.getElementById('timer').style.color = '#ffffff';
			break;
		case 1: // If state is 1, set audio file to play, message content and color.
			console.info('New state set: Paused.');
			audioFile = 'audio/sounds-882-solemn.mp3';
			message = 'Paused.';
			document.getElementById('timer').style.color = 'orange';
			break;
		case 2: // If state is 2, set audio file to play, message content and color.
			console.info('New state set: Pomodoro Cycle.');
			audioFile = 'audio/sounds-766-graceful.mp3';
			message = 'Work time!';
			document.getElementById('timer').style.color = '#13747d';
			break;
		case 3: // If state is 3, set audio file to play, message content and color.
			console.info('New state set: Break Cycle.');
			audioFile = 'audio/31_oringz-pack-nine-15.mp3';
			message = 'Break time!';
			document.getElementById('timer').style.color = '#fc354c';
			// break;
	}

	// If state is 1, 2 or 3, play audio file.
	if (state === 1 || state === 2 || state === 3) {
		var audio = new Audio(audioFile);
		audio.play();
	}

	// Update display with current time and message.
	this.updateDisplay(this.timeLeft, message);
};

var elPomodoroTime = document.getElementById('pomodoro-time'),
		elBreakTime = document.getElementById('break-time'),
		elPomUp = document.getElementById('pomodoro-time-up'),
		elPomDown = document.getElementById('pomodoro-time-down'),
		elBreakUp = document.getElementById('break-time-up'),
		elBreakDown = document.getElementById('break-time-down'),
		elStart = document.getElementById('start'),
		elPause = document.getElementById('pause'),
		elReset = document.getElementById('reset');

var fccPomodoro = new Pomodoro(25, 5, 'timer', 'msg-display');

elStart.addEventListener('click', function() {
	fccPomodoro.start();
});

elPause.addEventListener('click', function() {
	fccPomodoro.pause();
});

elReset.addEventListener('click', function() {
	fccPomodoro.reset();
});

elPomUp.addEventListener('click', function() {
	console.log('state - PomUp:', fccPomodoro.state);
	if (fccPomodoro.state === 0 || fccPomodoro.state === 1) {
		elPomodoroTime.innerText = parseInt(elPomodoroTime.innerText) === 999 ? 999 : parseInt(elPomodoroTime.innerText) + 1;
		fccPomodoro.updateTimes(elPomodoroTime.innerText, elBreakTime.innerText);
	}
});

elPomDown.addEventListener('click', function() {
	if (fccPomodoro.state === 0 || fccPomodoro.state === 1) {
		elPomodoroTime.innerText = parseInt(elPomodoroTime.innerText) === 1 ? 1 : parseInt(elPomodoroTime.innerText) - 1;
		fccPomodoro.updateTimes(elPomodoroTime.innerText, elBreakTime.innerText);
	}
});

elBreakUp.addEventListener('click', function() {
	if (fccPomodoro.state === 0 || fccPomodoro.state === 1) {
		elBreakTime.innerText = parseInt(elBreakTime.innerText) === 999 ? 999 : parseInt(elBreakTime.innerText) + 1;
		fccPomodoro.updateTimes(elPomodoroTime.innerText, elBreakTime.innerText);
	}
});

elBreakDown.addEventListener('click', function() {
	if (fccPomodoro.state === 0 || fccPomodoro.state === 1) {
		elBreakTime.innerText = parseInt(elBreakTime.innerText) === 1 ? 1 : parseInt(elBreakTime.innerText) - 1;
		fccPomodoro.updateTimes(elPomodoroTime.innerText, elBreakTime.innerText);
	}
});