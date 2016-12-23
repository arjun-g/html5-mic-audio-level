(function(){

    function MicAudioLevel(deviceId, callback){

        var AudioContext = AudioContext;

        var constraints = {
            audio: {
                deviceId: deviceId ? { exact: deviceId } : undefined
            },
            video: false
        }

        var currentStream = null
        var audioContext = new AudioContext()

        navigator
        .mediaDevices
        .getUserMedia(constraints)
        .then(gotStream)
        .catch(failedStream)

        function gotStream(stream){

            currentStream = stream

            var analyser = audioContext.createAnalyser()
            var microphone = audioContext.createMediaStreamSource(stream)
            var javascriptNode = audioContext.createScriptProcessor(2048, 1, 1)

            analyser.smoothingTimeConstant = 0.3;
            analyser.fftSize = 1024;

            microphone.connect(analyser);
            analyser.connect(javascriptNode);
            javascriptNode.connect(audioContext.destination);

            javascriptNode.onaudioprocess = () => {

                var array = new Uint8Array(analyser.frequencyBinCount)
                analyser.getByteFrequencyData(array)

                var values = 0;
                array.forEach((value) => {
                    values += value
                })

                callback(null, maxValue(values / array.length))

            }

        }

        function failedStream(err){

            callback(err, null)

        }

        this.dispose = this.destroy = function(){

            if(currentStream){
                currentStream.getTracks().forEach(track => {
                    track.stop()
                })
            }
            audioContext.close()

        }

    }

    function maxValue(value, max){
        return value > max ? max : value
    }

    window.MicAudioLevel = MicAudioLevel

})()