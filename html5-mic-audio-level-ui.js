(function(){

    function MicAudioLevelUI(containerDom, options){

        const BACKGROUND_HORIZONTAL = 'linear-gradient(to right, #2eea4e 0%,#f2fc2f 49%,#f2fc2f 73%,#ff2626 100%)',
              BACKGROUND_VERTICAL = 'linear-gradient(to top, #2eea4e 0%,#f2fc2f 49%,#f2fc2f 73%,#ff2626 100%)',
              DIRECTION_HORIZONTAL = 'horizontal',
              DIRECTION_VERTICAL = 'vertical'
              
        var opt = {
            direction: DIRECTION_HORIZONTAL
        } 

        if(options)
            extend(opt, options)

        if(!opt.background)
            opt.background = opt.direction === DIRECTION_VERTICAL ? BACKGROUND_VERTICAL : BACKGROUND_HORIZONTAL

        var progressContainerDom = document.createElement('DIV'),
            progressDom = document.createElement('DIV')

        progressDom.style.background = opt.background

        if(opt.direction === DIRECTION_HORIZONTAL){
            progressContainerDom.style.width = '0'
            progressContainerDom.style.height = '100%'
            progressContainerDom.style.overflow = 'hidden'
            
            progressDom.style.width = containerDom.clientWidth + 'px'
            progressDom.style.height = '100%'

            progressContainerDom.appendChild(progressDom)
            containerDom.appendChild(progressContainerDom)
        }

        function extend(target, obj) {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    target[key] = obj[key]
                }
            }
        }

        var micAudioLevel = new MicAudioLevel(opt.deviceId, (err, level) => {
            progressContainerDom.style.width = level + '%'
        })

        this.dispose = this.destroy = function(){

            micAudioLevel.dispose()

            progressDom.remove()
            progressContainerDom.remove()

        }
        
    }

    window.MicAudioLevelUI = MicAudioLevelUI;

})()