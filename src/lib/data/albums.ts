import type { Album } from '$lib/types/album';

export const getAlbumPath = (path: string) => {
    // This will be replaced at runtime with the correct base path
    return `/albums${path}`;
};

export const albums: Album[] = [
    {
        id: 'taylor_swift',
        title: 'Debut',
        coverArt: getAlbumPath('/taylor_swift.png'),
        releaseYear: 2006,
        isTaylorsVersion: false,
        color: '#D9CAB3',
        songs: [
            'Tim McGraw', 'Picture to Burn', 'Teardrops on My Guitar', 'A Place in This World',
            'Cold as You', 'The Outside', 'Tied Together with a Smile', 'Stay Beautiful',
            'Should\'ve Said No', 'Mary\'s Song (Oh My My My)', 'Our Song'
        ]
    },
    {
        id: 'fearless_tv',
        title: 'Fearless (Taylor\'s Version)',
        coverArt: getAlbumPath('/fearless_tv.png'),
        releaseYear: 2021,
        isTaylorsVersion: true,
        color: '#F4E5B2',
        songs: [
            'Fearless', 'Fifteen', 'Love Story', 'Hey Stephen', 'White Horse',
            'You Belong With Me', 'Breathe', 'Tell Me Why', 'You\'re Not Sorry',
            'The Way I Loved You', 'Forever & Always', 'The Best Day', 'Change'
        ]
    },
    {
        id: 'speak_now_tv',
        title: 'Speak Now (Taylor\'s Version)',
        coverArt: getAlbumPath('/speak_now_tv.png'),
        releaseYear: 2023,
        isTaylorsVersion: true,
        color: '#D1A0A2',
        songs: [
            'Mine', 'Sparks Fly', 'Back To December', 'Speak Now', 'Dear John',
            'Mean', 'The Story Of Us', 'Never Grow Up', 'Enchanted',
            'Better Than Revenge', 'Innocent', 'Haunted', 'Last Kiss', 'Long Live'
        ]
    },
    {
        id: 'red_tv',
        title: 'Red (Taylor\'s Version)',
        coverArt: getAlbumPath('/red_tv.png'),
        releaseYear: 2021,
        isTaylorsVersion: true,
        color: '#B02428',
        songs: [
            'State Of Grace', 'Red', 'Treacherous', 'I Knew You Were Trouble',
            'All Too Well', '22', 'I Almost Do', 'We Are Never Ever Getting Back Together',
            'Stay Stay Stay', 'The Last Time', 'Holy Ground', 'Sad Beautiful Tragic',
            'The Lucky One', 'Everything Has Changed', 'Starlight', 'Begin Again'
        ]
    },
    {
        id: '1989_tv',
        title: '1989 (Taylor\'s Version)',
        coverArt: getAlbumPath('/1989_tv.png'),
        releaseYear: 2023,
        isTaylorsVersion: true,
        color: '#8CD1E6',
        songs: [
            'Welcome To New York', 'Blank Space', 'Style', 'Out Of The Woods',
            'All You Had To Do Was Stay', 'Shake It Off', 'I Wish You Would',
            'Bad Blood', 'Wildest Dreams', 'How You Get The Girl', 'This Love',
            'I Know Places', 'Clean'
        ]
    },
    {
        id: 'reputation',
        title: 'Reputation',
        coverArt: getAlbumPath('/reputation.png'),
        releaseYear: 2017,
        isTaylorsVersion: false,
        color: '#323232',
        songs: [
            '...Ready For It?', 'End Game', 'I Did Something Bad', 'Don\'t Blame Me',
            'Delicate', 'Look What You Made Me Do', 'So It Goes...', 'Gorgeous',
            'Getaway Car', 'King Of My Heart', 'Dancing With Our Hands Tied',
            'Dress', 'This Is Why We Can\'t Have Nice Things', 'Call It What You Want',
            'New Year\'s Day'
        ]
    },
    {
        id: 'lover',
        title: 'Lover',
        coverArt: getAlbumPath('/lover.png'),
        releaseYear: 2019,
        isTaylorsVersion: false,
        color: '#E8C1E1',
        songs: [
            'I Forgot That You Existed', 'Cruel Summer', 'Lover', 'The Man',
            'The Archer', 'I Think He Knows', 'Miss Americana & The Heartbreak Prince',
            'Paper Rings', 'Cornelia Street', 'Death By A Thousand Cuts', 'London Boy',
            'Soon You\'ll Get Better', 'False God', 'You Need To Calm Down', 'Afterglow',
            'ME!', 'It\'s Nice To Have A Friend', 'Daylight'
        ]
    },
    {
        id: 'folklore',
        title: 'folklore',
        coverArt: getAlbumPath('/folklore.png'),
        releaseYear: 2020,
        isTaylorsVersion: false,
        color: '#ACA9A0',
        songs: [
            'the 1', 'cardigan', 'the last great american dynasty', 'exile',
            'my tears ricochet', 'mirrorball', 'seven', 'august',
            'this is me trying', 'illicit affairs', 'invisible string',
            'mad woman', 'epiphany', 'betty', 'peace', 'hoax'
        ]
    },
    {
        id: 'evermore',
        title: 'evermore',
        coverArt: getAlbumPath('/evermore.png'),
        releaseYear: 2020,
        isTaylorsVersion: false,
        color: '#A3BFA8',
        songs: [
            'willow', 'champagne problems', 'gold rush', '\'tis the damn season',
            'tolerate it', 'no body, no crime', 'happiness', 'dorothea',
            'coney island', 'ivy', 'cowboy like me', 'long story short',
            'marjorie', 'closure', 'evermore'
        ]
    },
    {
        id: 'midnights',
        title: 'Midnights',
        coverArt: getAlbumPath('/midnights.png'),
        releaseYear: 2022,
        isTaylorsVersion: false,
        color: '#1A1A3D',
        songs: [
            'Lavender Haze', 'Maroon', 'Anti-Hero', 'Snow On The Beach', 
            'You\'re On Your Own, Kid', 'Midnight Rain', 'Question...?', 
            'Vigilante Shit', 'Bejeweled', 'Labyrinth', 'Karma', 
            'Sweet Nothing', 'Mastermind'
        ]
    },
    {
        id: 'ttpd',
        title: 'TTPD',
        coverArt: getAlbumPath('/ttpd.png'),
        releaseYear: 2024,
        isTaylorsVersion: false,
        color: '#ccbcaf',
        songs: []
    }
];
