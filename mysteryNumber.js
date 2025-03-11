let randomNumber = null;

function generateRandomNumber() {
    randomNumber = Math.floor(Math.random() * 100) + 1;
    return randomNumber;
}

function compareNumbers(randomNumber, userNumber){
    if(userNumber < randomNumber){
        return {
            error: true,
            msg: 'Le nombre mystère est plus grand',
            type: 'warning'
        };
    } else if(userNumber > randomNumber){
        return {
            error: true,
            msg: 'Le nombre mystère est plus petit',
            type: 'warning'
        };
    } else {
        return {
            error: false,
            msg: 'Bravo, vous avez trouvé le nombre mystère !',
            type: 'success'
        };
    }
};

const getRandomNumber = () => {
    return randomNumber;
};

module.exports = {
    generateRandomNumber, 
    compareNumbers, 
    getRandomNumber
};