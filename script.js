const {
    StyledComponent,
} = Torus;

const PER_WORD = 570; // milliseconds

const STATE = {
    PRESTART: 0,
    PLAYING: 1,
    FINAL: 2,
}

const SPANS = [
  '...',
  '...',
  '...',
  ' ',
  'We\'re no strangers to love',
  'You know the rules and so do I',
  'A full commitment\'s what I\'m thinking of',
  'You wouldn\'t get this from any other guy',
  'I just wanna tell you how I\'m feeling',
  '...',
  'Gotta make you understand',
  'Never gonna give you up',
  'Never gonna let you down',
  'Never gonna run around and desert you',
  'Never gonna make you cry',
  'Never gonna say goodbye',
  'Never gonna tell a lie and hurt you',
  'We\'ve known each other for so long',
  'Your heart\'s been aching but you\'re too shy to say it',
  'Inside we both know what\'s been going on',
  'We know the game and we\'re gonna play it',
  'And if you ask me how I\'m feeling',
  'Don\'t tell me you\'re too blind to see',
  'Never gonna give you up',
  'Never gonna let you down',
  'Never gonna run around and desert you',
  'Never gonna make you cry',
  'Never gonna say goodbye',
  'Never gonna tell a lie and hurt you',
  'Never gonna give you up',
  'Never gonna let you down',
  'Never gonna run around and desert you',
  '...',
  'Never gonna make you cry',
  'Never gonna say goodbye',
  'Never gonna tell a lie and hurt you',
  '...',
  'Never gonna give, never gonna give',
  '(Give you up)',
  '(Ooh) Never gonna give, never gonna give',
  '(Give you up)',
  'We\'ve known each other for so long',
  'Your heart\'s been aching but you\'re too shy to say it',
  'Inside we both know what\'s been going on',
  'We know the game and we\'re gonna play it',
  'I just wanna tell you how I\'m feeling',
  'Gotta make you understand',
  '...',
  'Never gonna give you up',
  'Never gonna let you down',
  'Never gonna run around and desert you',
  '...',
  'Never gonna make you cry',
  'Never gonna say goodbye',
  'Never gonna tell a lie and hurt you',
  '...',
  'Never gonna give you up',
  'Never gonna let you down',
  'Never gonna run around and desert you',
  'Never gonna make you cry',
  'Never gonna say goodbye',
  '...',
  'Never gonna tell a lie and hurt you',
  'Never gonna give you up',
  'Never gonna let you down',
  'Never gonna run around and desert you',
  'Never gonna make you cry',
];

const countWords = s => {
    if (s === '...') {
        // ellipsized lines indicate pause
        return 10;
    } else {
        return s.split(/\s+/).length;
    }
    if (s === '.') {
        // ellipsized lines indicate pause
        return 5;
    } else {
        return s.split(/\s+/).length;
    }
}


class App extends StyledComponent {

    init() {
        this.index = -1;
        this.timer = null;
        this.state = STATE.PRESTART;
    }

    setNextTimeout() {
        this.timer = setTimeout(() => {
            this.index ++;
            this.render();

            if (this.index + 1 < SPANS.length) {
                this.timer = setTimeout(
                    this.setNextTimeout.bind(this),
                    countWords(SPANS[this.index]) * PER_WORD,
                );
            } else {
                this.timer = setTimeout(() => {
                    this.final = true;
                    this.state = STATE.FINAL;
                    this.render();
                }, 1200);
            }
        })
    }

    play() {
        const $iap = document.body.querySelector('audio');
        $iap.volume = 1;
        if ($iap.readyState === 4) {
            $iap.play();
        } else {
            // try to play, which will load the audio file
            $iap.play();

            $iap.addEventListener('canplay', () => {
                $iap.play();
            });
        }
    }

    styles() {
        return css`
        font-family: 'EB Garamond', 'Georgia', serif;
        font-size: 1.25rem;
        max-width: 28rem;
        margin: 3rem auto;

        .activeArea {
            position: absolute;
            top: 30vh;
            left: 50%;
            transform: translateX(-50%);
            text-align: center;
        }

        button.clickme {
            font-family: 'EB Garamond', 'Georgia', serif;
            background: #fff;
            color: #000;
            font-size: 1.25rem;
            border-radius: 4px;
            padding: .25em .5em;
            border: 2px solid #aaa;
        }

        p {
            display: block;
            margin: .25em auto;
            line-height: 1.5rem;
            opacity: 1;
            transform: translateY(-.15rem);
            transition: opacity 1s, transform 1s;

            &.hidden {
                opacity: 0;
                transform: translateY(0px);
            }

            &.grey {
                transition: opacity 2s;
                opacity: .18;
            }

            &.attribution {
                margin-top: 1.8rem;
                text-align: center;
            }

            &.instructions {
                margin-top: 1rem;
                opacity: .5;
                font-size: 1rem;
            }
        }
        `;
    }

    compose() {
        if (this.state === STATE.PRESTART) {
            return jdom`<div class="poem prestart">
                <div class="activeArea">
                    <button class="clickme" onclick="${() => {
                        this.state = STATE.PLAYING;
                        this.play();
                        this.render();
                        setTimeout(this.setNextTimeout.bind(this), 500);
                    }}">Click me! 😺</button>
                    <p class="instructions">(Audio on!)</p>
                </div>
            </p>`;
        }

        if (this.state === STATE.FINAL) {
            return jdom`<div class="poem final">
                ${SPANS.map((line, i) => {
                    if (i + 1 === SPANS.length) {
                        return jdom`<p>${line}</p>`;
                    } else {
                        return jdom`<p class="grey">${line}</p>`;
                    }
                })}
                <p class="attribution">~ vdj</p>
            </div>`;
        }

        return jdom`<div class="poem playing">
            ${SPANS.map((line, i) => {
                if (i <= this.index) {
                    return jdom`<p>${line}</p>`;
                } else {
                    return jdom`<p class="hidden">${line}</p>`;
                }
            })}
            <p class="attribution hidden">~ vdj</p>
        </div>`;
    }

}

const app = new App();
document.body.appendChild(app.node);
