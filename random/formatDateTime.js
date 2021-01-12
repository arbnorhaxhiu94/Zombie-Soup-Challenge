export const dateTimeFormater = (unformatedDate) => {
    console.log('unformatedDate: '+ unformatedDate)
    let month = unformatedDate.substring(4,7)
    let year = unformatedDate.substring(11,15)
    let date = unformatedDate.substring(8,10)
    let time = unformatedDate.substring(16,24)
    switch(month) {
        case 'Jan':
            month = '01';
            break;
        case 'Feb':
            month = '02';
            break;
        case 'Mar':
            month = '03';
            break;
        case 'Apr':
            month = '04';
            break;
        case 'May':
            month = '05';
            break;
        case 'Jun':
            month = '06';
            break;
        case 'Jul':
            month = '07';
            break;
        case 'Aug':
            month = '08';
            break;
        case 'Sep':
            month = '09';
            break;
        case 'Oct':
            month = '10';
            break;
        case 'Nov':
            month = '11';
            break;
        case 'Dec':
            month = '12';
            break;
    }
    var formatedDate = year+'-'+month+'-'+date+' '+time
    console.log('formated date: '+formatedDate)
    return formatedDate
}