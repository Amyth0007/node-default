
module.exports = getdate;

function getdate(){
date = new Date();
    var day = ['sunday' , 'monday' , 'tuesday' , 'wednesday' , 'thursday' , 'friday' , 'saturday']
    
   var currentday = date.getDay();
   console.log(currentday);
   let amit= '';
   for (let index = 0; index < 7; index++) {
        if(currentday === index){

            amit = day[index];
            console.log(amit);
            break;
        }
        
    }
    return amit;
}