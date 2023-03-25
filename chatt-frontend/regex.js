const allUsers = ['Opeyemi', 'Oreoluwa', 'Fiyin', 'Ayomide', 'Ayodele', 'Oluwatobu',
'joy', 'Renee', 'Bolatito', 'Aphrotee', 'Pamilerin', 'Aphrtee', 'Ibrahim', 'Idris', 'oluwa',
'binta', 'pelumi', 'Funto', 'funmi', 'benita']
const n = 'A';

const regex = new RegExp(`^${n}`, 'i');
console.log(allUsers.map((value) => {
    if (regex.test(value)) {
        return true;
    } else {
        return false;
    }
}));