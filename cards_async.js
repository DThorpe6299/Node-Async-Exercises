let baseURL = "https://deckofcardsapi.com/api/deck";

async function cardPull(){
    let url = `${baseURL}/new/draw?count=1`;
    let card = await axios.get(url)
    let { value, suit } = card.data.cards[0];
    console.log(`${value.toLowerCase()} of ${suit.toLowerCase()}`)
}

let firstCard = null;
async function pickCards(){
    let url = `${baseURL}/new/draw?count=1`;
    let firstCardRes = await axios.get(url)
    firstCard = firstCardRes.data.cards[0]
    let deckID = firstCard.data.deck_id;
    url = `${baseURL}/${deckID}/draw?count=1`;
    
    let secondCardRes = await axios.get(url)
    let secondCard = secondCardRes.data.cards[0];
    
    [firstCard.data.cards[0], secondCard].forEach(function(card) {
        console.log(
            `${card.value.toLowerCase()} of ${card.suit.toLowerCase()}`
        );
    });
}

let deckID=null;
let $btn = $('button');
let $restart = $('#restart')
let $cardArea = $('#card-div');
let currDeck;

async function shuffleDeck(){
    $cardArea.empty()
    currDeck= await axios.get(`${baseURL}/new/shuffle/`)
    console.log('from Shuffle Deck Function:', currDeck)
    deckID = currDeck.data.deck_id
    console.log('from Shuffle Deck Function:', deckID)
    return currDeck;
}
shuffleDeck();

async function pickACard() {
    if (!deckID) {
        console.log('Deck has not been shuffled.');
        return;
    }

    let response = await axios.get(`${baseURL}/${deckID}/draw/?count=1`);
    console.log('response from pickACard',response)
    let drawnCard = response.data.cards[0];

    console.log('drawnCard', drawnCard)
    let cardSrc = drawnCard.image;
    let angle = Math.random() * 90 - 45;
    let randomX = Math.random() * 40 - 20;
    let randomY = Math.random() * 40 - 20;
    $cardArea.append(
        $('<img>', {
            src: cardSrc,
            css: {
                transform: `translate(${randomX}px, ${randomY}px) rotate(${angle}deg)`
            }
        })
    );
    console.log(response.data.remaining)
    if (response.data.remaining === 0) {
        $btn.remove();
        $restart.show()
    }
}
$restart.on('click', shuffleDeck)
$btn.on('click', pickACard);