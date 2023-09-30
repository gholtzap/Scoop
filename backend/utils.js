const symptoms = [
    'fever', 'fatigue', 'cough', 'shortnessOfBreath', 'soreThroat', 'runnyNose', 
    'bodyAches', 'headache', 'chills', 'nausea', 'diarrhea', 'lossOfAppetite', 'sweating',
    'jointPain', 'swollenLymphNodes', 'rash', 'abdominalPain', 'dizziness', 'lossOfTasteOrSmell',
    'chestPain'
]

function getSymptomsData(entries, daysBack){
    const currentDate = new Date();
    const currentTime = currentDate.getTime();
    const day = Math.floor(currentTime / (1000 * 60 * 60 * 24))

    let targetDay = day - daysBack
    //binary search
    let startIndex = binarySearchDays(entries, targetDay);
    let endIndex = entries.length - 1;
    const symptomsSum = {};
    symptoms.forEach((item, index) => {
        symptomsSum[item] = entries[endIndex]['symptoms'][item] - entries[startIndex]['symptoms'][item];
    })
    return symptomsSum
}

function binarySearchDays(entries, targetDay) {
  
    let start=0, end=entries.length-1;
         
    // Iterate while start not meets end
    while (start<=end){
 
        // Find the mid index
        let mid=Math.floor((start + end)/2);
  
        // If element is present at mid, return True
        if (entries[mid]['day'] === targetDay) return mid;
 
        // Else look in left or right half accordingly
        else if (entries[mid]['day'] < targetDay)
             start = mid + 1;
        else
             end = mid - 1;
    }
  
    return start;
}

module.exports = { getSymptomsData };