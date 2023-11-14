export class Detector {
    private words: string[] = [];
    private wordsDetected: { [key: string]: number } = {};

    constructor(words: string[]) {
        this.words = words;
    }

    detect() {
        // Search in the DOM for the words and count them
        document.body.innerText.split(' ').forEach(word => {
            if (this.words.indexOf(word) !== -1) {
                if (this.wordsDetected[word]) {
                    this.wordsDetected[word]++;
                } else {
                    this.wordsDetected[word] = 1;
                }
            }
        });

        return this.wordsDetected;
    }

    static create() {
        return new Detector(['durabilité', 'vert', 'écologique', 'bio', 'Summary']);
    }
}