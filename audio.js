// AUDIO JAVASCRIPT FILE - TONE.JS

console.clear();


/* --- VARIABLES --- */
let playBtn = document.getElementById("play-button");
let stopBtn = document.getElementById("stop-button");
let masterVolumeSlider = document.getElementById("master-vol");
let masterVolumeOutputValue = document.getElementById("master-vol-value");
let masterVolume;
const sequencers = [];


/* --- MASTER CONTROLS --- */
// Play Function
function playAudio() {

    // - Loops through each channel and starts the sequencers
    if (channels[1].sequencer, channels[2].sequencer, channels[3].sequencer, channels[4].sequencer) {
        channels[1].sequencer.start(0);
        channels[2].sequencer.start(0);
        channels[3].sequencer.start(0);
        channels[4].sequencer.start(0);
    }

    Tone.Transport.start();
    console.log("Audio Playing");
}

playBtn.onclick = playAudio; // Calls playAudio function

// Stop Function
function stopAudio() {
    Tone.Transport.stop(); // Stops all Tone.Transport
    console.log("Audio Stopping");
}

stopBtn.onclick =  stopAudio; // Calls stopAudio function

// Tempo Control
let tempoInput = document.getElementById("tempo-control");

tempoInput.addEventListener("input", () => {
  let bpm = Number(tempoInput.value); // Listens for user bpm input

  if (bpm >= 60 && bpm <= 200) { // Makes the minimum bpm 60, and maximum bpm 200
    Tone.Transport.bpm.value = bpm; // Makes Tone.Transport equal what the user inputted
    Tone.Transport.timeSignature = 4; 
    console.log(`Tempo: ${bpm}`);
  }

  return bpm;
});

// Master Volume
masterVolumeOutputValue.textContent = masterVolumeSlider.value; 

// - Sets up Master Volume with Tone.Master 
masterVolume = new Tone.Gain(masterVolumeSlider.value/10);
masterVolume.connect(Tone.Master);

// - Listens for changes in the slider and updates the volume and label 
masterVolumeSlider.addEventListener("input", () => {
    masterVolumeOutputValue.textContent = masterVolumeSlider.value; // Updates value when slider is moved
    masterVolume.gain.value = masterVolumeSlider.value / 10; // Updates the master volume in real time by accessing Tone.Gain's gain parameters
});


/* --- CREATE CHANNEL FUNCTION --- */
function createChannel(channelNumber) {

    const channel = {
        instrumentSelection: document.querySelector(`#inst-select-${channelNumber}`),

        volumeSlider: document.getElementById(`volume-${channelNumber}`),
        volumeOutputValue: document.getElementById(`vol-value-${channelNumber}`),

        panSlider: document.getElementById(`pan-control-${channelNumber}`),
        panOutputValue: document.getElementById(`pan-value-${channelNumber}`),

        // effectSelection: document.getElementsByName(`fx-select-${channelNumber}`),

        reverbEffect: document.getElementById(`reverb-${channelNumber}`),
        delayEffect: document.getElementById(`delay-${channelNumber}`),

        effectSlider: document.getElementById(`fx-control-${channelNumber}`),
        effectOutputValue: document.getElementById(`fx-value-${channelNumber}`)
    }

    // Instrument Selection
    channel.instrumentSelection.addEventListener("change", e => {
        console.log(`Channel ${channelNumber} Instrument:`, e.target.value);
        sequencerGrid(channelNumber);
    });

    // Volume Slider
    // - Updates volume output value in the UI
    channel.volumeOutputValue.textContent = channel.volumeSlider.value; 

    // - Sets up the channel volume and links to the master volume slider
    channel.gain = new Tone.Gain((channel.volumeSlider.value)/10).connect(masterVolume);

    // - Listens for changes in the slider and updates the volume and label 
    channel.volumeSlider.addEventListener("input", () => {
        channel.volumeOutputValue.textContent = channel.volumeSlider.value; // Updates value when slider is moved
        channel.gain.gain.value = channel.volumeSlider.value / 10; // Updates the channel volume in real time by accessing Tone.Gain's gain parameters
    });

    // Pan Slider
    // - Sets up the channel pan and links to channel volume slider
    channel.pan = new Tone.Panner(channel.panSlider.value).connect(channel.gain);

    // - Improves Readability of Default Number Labels to Directional Labels in the UI
    function updatePanOutputLabel() {
        channel.panValue = Number(channel.panSlider.value);

        if (channel.panValue === 1) {
            channel.panOutputValue.textContent = "R";
        } 
        
        else if (channel.panValue === 0) {
            channel.panOutputValue.textContent = "C";
        } 
        
        else if (channel.panValue === -1) {
            channel.panOutputValue.textContent = "L";
        }
    } updatePanOutputLabel();

    // - Listens for changes in the slider and updates the pan and label
    channel.panSlider.addEventListener("input", () => {
        updatePanOutputLabel(); // Updates UI pan labels
        channel.pan.pan.value = channel.panSlider.value; // Reads the pan slider and updates the pan direction
        console.log(`Channel ${channelNumber} pan position:`, channel.panSlider.value); // Updates pan direction in the console log
    });

    // Effects Selection
    channel.reverb = new Tone.Freeverb(channel.effectSlider.value/10).connect(channel.pan);
    channel.delay = new Tone.FeedbackDelay(channel.effectSlider.value/10).connect(channel.pan);

    channel.reverbEffect.addEventListener("click", () => {
        console.log(`Channel ${channelNumber}: Reverb is enabled`, (channel.reverbEffect).checked);
        console.log(`Channel ${channelNumber}: Delay is disabled`, (channel.delayEffect).checked);
        console.log("You have selected: Reverb");
    });

    channel.delayEffect.addEventListener("click", () => {
        console.log(`Channel ${channelNumber}: Reverb is disabled`, (channel.reverbEffect).checked);
        console.log(`Channel ${channelNumber}: Delay is enabled`, (channel.delayEffect).checked);
        console.log("You have selected: Delay");
    });

    // Effects Slider
    channel.effectOutputValue.textContent = channel.effectSlider.value;

    channel.effectSlider.addEventListener("input", () => {
        channel.effectOutputValue.textContent = channel.effectSlider.value;

        console.log(`Channel ${channelNumber} effect mix:`, ((channel.effectSlider.value)*100)); // Updates effect slider mix in the console log

        // - If reverb is selected, turn off delay and make slider control reverb room size
        if ((channel.reverbEffect).checked) {
            channel.delay.delayTime.value = 0; // If effectSlider was previous set to delay, this turns the delay off so the effectSlider can control the reverb
            channel.effectSlider.value;
            channel.reverb.roomSize.value = channel.effectSlider.value;
            console.log("Effect Slider: Reverb");
        }

        // - If delay is selected, turn off reverb and make slider control delay time
        else if (((channel.delayEffect).checked) == true) {
            channel.reverb.roomSize.value = 0; // If effectSlider was previous set to reverb, this turns the reverb off so the effectSlider can control the delay
            channel.delay.delayTime.value = channel.effectSlider.value;
            console.log("Effect Slider: Delay");
        } 

        // - If both radio buttons are unchecked, turn both effects off
        else if ((channel.reverbEffect) && (channel.delayEffect) == false) {
            channel.delay.delayTime.value = 0;
            channel.reverb.roomSize.value = 0;
        }
    });

    return channel;
};

/* --- CREATE SEQUENCERS FUNCTION --- */
function createSequencers(channel, player, seqGrid){

    // Links the player to Tone.Sequence to allow playback
    return new Tone.Sequence((time, note) => {

        const currentStep = seqGrid.querySelectorAll (
            `button[data-column="${note}"].active`
        );

        currentStep.forEach(btn => {
            const seqRow = btn.dataset.row;
            player.player(seqRow).start(time);
        });

    }, [...Array(8).keys()], "8n"); // Creates an arry of zeros to be filled by active buttons
};


/* --- CREATE SEQUENCER GRID FUNCTION --- */
function sequencerGrid(sequencerNumber) {
    const seqGrid = document.getElementById(`sequencer-${sequencerNumber}`);

    const channel = channels[sequencerNumber];

    // Creates the Sequencers Types Based on the Instrument Selection
    const sequencerType = {

        // - Guitar
        guitarPlayer: new Tone.Players({
            urls: {
                0: "Guitar_G3.mp3",
                1: "Guitar_Fs3.mp3",
                2: "Guitar_E3.mp3",
                3: "Guitar_D3.mp3", 
                4: "Guitar_C3.mp3", 
                5: "Guitar_B2.mp3", 
                6: "Guitar_A2.mp3", 
                7: "Guitar_G2.mp3",
            },

                baseUrl: "../assets/audio-samples/Guitar/",
        }).connect(channel.pan).connect(channel.reverb).connect(channel.delay),

        // - Piano
        pianoPlayer: new Tone.Players({
            urls: {
                0: "Piano_G4.mp3",
                1: "Piano_Fs4.mp3",
                2: "Piano_E4.mp3",
                3: "Piano_D4.mp3", 
                4: "Piano_C4.mp3", 
                5: "Piano_B3.mp3", 
                6: "Piano_A3.mp3", 
                7: "Piano_G3.mp3",
            },

                baseUrl: "../assets/audio-samples/Piano/",
        }).connect(channel.pan).connect(channel.reverb).connect(channel.delay),

        // - Bass
        bassPlayer: new Tone.Players({
            urls: {
                0: "Bass_G1.mp3",
                1: "Bass_Fs1.mp3",
                2: "Bass_E1.mp3",
                3: "Bass_D1.mp3", 
                4: "Bass_C1.mp3", 
                5: "Bass_B0.mp3", 
                6: "Bass_A0.mp3", 
                7: "Bass_G0.mp3",
            },

                baseUrl: "../assets/audio-samples/Bass/",
        }).connect(channel.pan).connect(channel.reverb).connect(channel.delay),

        // - Drums
        drumsPlayer: new Tone.Players({
            urls: {
                0: "HiHats.mp3",
                1: "Snare.mp3",
                2: "Kick.mp3",
            },

                baseUrl: "../assets/audio-samples/Drums/",
        }).connect(channel.pan).connect(channel.reverb).connect(channel.delay),
    };

    // Assigns Each Instrument with the Correct Amount of Samples
    const samplesPerPlayer = {
        Guitar: 8,
        Piano: 8,
        Bass: 8,
        Drums: 3
    };

    // Assigns Labels to Sequencer Buttons Based on the Selected Instrument
    const instrumentBtnLabels = {
        Guitar: ["G", "F#", "E", "D", "C", "B", "A", "G"],
        Piano: ["G", "F#", "E", "D", "C", "B", "A", "G"],
        Bass: ["G", "F#", "E", "D", "C", "B", "A", "G"],
        Drums: ["H", "S", "K"]
    };

    // Defines the Correct Sequencer Type Based on the Instrument Selection
    let player;

    // Assigns the correct player and sequencers to each instrument selection
    if (channel.instrumentSelection.value === "Guitar") {
        player = sequencerType.guitarPlayer;
        channel.sequencer = createSequencers(channel, player, seqGrid);
    } 
    else if (channel.instrumentSelection.value === "Piano") {
        player = sequencerType.pianoPlayer; 
        channel.sequencer = createSequencers(channel, player, seqGrid);
    } 
    else if (channel.instrumentSelection.value === "Bass") {
        player = sequencerType.bassPlayer;
        channel.sequencer = createSequencers(channel, player, seqGrid);
    } 
    else if (channel.instrumentSelection.value === "Drums") {
        player = sequencerType.drumsPlayer;
        channel.sequencer = createSequencers(channel, player, seqGrid);
    }

    console.log("Player:", channel.instrumentSelection.value);

    const columns = 8; // Creates the correct number of columns in the sequencer
    const rows = samplesPerPlayer[channel.instrumentSelection.value]; // Creates the correct number of rows in the sequencer based on the amount of samples in the tone player

    // Clears the Previous Sequencer Grid When Swapping Instruments in a Channel
    seqGrid.innerHTML = "";
    console.log("Clearing previous sequencer grid");

    // Logs how many Rows/Columns are in each sequencer
    console.log("Rows:", rows, "Columns:", columns);

    // Loops through the instruments to create the sequencer grids
    if (["Guitar", "Piano", "Bass", "Drums"].includes(channel.instrumentSelection.value)) {

        for (let row = 0; row < rows; row++){

            for (let column = 0; column < columns; column++){
                const button = document.createElement("button"); // Creates the buttons

                button.dataset.row = row;
                button.dataset.column = column;

                // - Adds the correct row number to differentiate the buttons for the player
                button.classList.add(`row-${row}`);

                seqGrid.appendChild(button); // Adds the buttons to the sequencer grid

                // - Plays the correct samples when a button is pressed
                button.addEventListener("click", () => {
                    player.player(row).start();
                    button.classList.toggle("active"); // Adds the class "active" if a button is pressed
                });

                // - Adds the labels to buttons based on the instrument selected
                const labels = instrumentBtnLabels[channel.instrumentSelection.value];

                // - Loops through the rows for each instrument and adds the correct labels
                if (labels && labels[row]) {
                    button.textContent = labels[row];
                }
            }
        }
    }

    return sequencerGrid;
};

/* --- LOAD IN CONTENT --- */
const channels = []; // Creates an empty array called "channels" to store all 4 channel in

// Instructs the browser to wait until the entire page is loaded before creating the channels and sequencers
window.addEventListener("DOMContentLoaded", () => {
    channels[1] = createChannel(1);
    channels[2] = createChannel(2);
    channels[3] = createChannel(3);
    channels[4] = createChannel(4);

    // - Loops through the 4 channels to create a sequencer for each channel
    for (let chan = 1; chan <= 4; chan++) {
        sequencerGrid(chan)
    }
});