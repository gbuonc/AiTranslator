const cloudVisionKey = 'AIzaSyCpDWzG8VmqTP_13Wj7IsIRr9UfhlU3zVA'
const translateKey   = ''

export const apiUrls = {
  cloudVision: 'https://vision.googleapis.com/v1/images:annotate?key=' + cloudVisionKey,
  translate:   'https://www.googleapis.com/language/translate/v2?key=' + translateKey
}
