//////////////////  JS /////////
/* ========================================================================
 * Real-time word synthetics v1.0
 * http://www.honesthao.cf
 * ========================================================================
 * Concept & Design (c) Hao
 * 1044504787@qq.com
 * ======================================================================== */

/////// interlinks added
var unscramble = require('unscramble');


var data_dictionary;
d3.csv("https://rawcdn.githack.com/hao-oah/PublicFiles/master/Abalone.csv", function(data) {
  data_dictionary = data;// d3 async nature.
});


var data_interlinks;
d3.csv("https://cdn.jsdelivr.net/gh/hao-oah/PublicFiles@12854f6f0a9deede2bd9da97d2cdef916d2ba37b/interlinks.csv", function(data) {
  data_interlinks = data;// d3 async nature.
});


setTimeout(function(){

function dict_relevance_NN(str, obj, links, N){ // N is a seq flag which determines which section it runs.
  var book=[''];
  var sample ='';
  var sample_entropy = 0;
  var global_count =0;
  var relevent_sentence ='';
  var linked_sentence ='';
  for (var i=0;i<obj.length;i++){
    if(obj[i].Abalone[0]==str[0]) book.push(obj[i].Abalone); // use the beginning as the logic anchor
  }
  sample = book[Math.floor(Math.random()*book.length)];  

  for(i=0;i<7;i++){
    relevent_sentence+=alphabet_match(Train_NN((sample[i]-0x0061)/(0x007A-0x0061),(str[i]-0x0061)/(0x007A-0x0061),100, 0.01),str[i],global_count)  
  }

  sample = links[Math.floor(Math.random()*links.length)];  // dataset load

  for(i=7*(N-1);i<7*N;i++){
    linked_sentence+=alphabet_match(Train_NN((sample[i]-0x0061)/(0x007A-0x0061),(relevent_sentence[i]-0x0061)/(0x007A-0x0061),4, 0.01),relevent_sentence[i],global_count)  // lower for now to avoid overfitting
  }
  if (unscramble(linked_sentence)[0] != 'No results found.')
  	linked_sentence = unscramble(linked_sentence)[Math.floor(Math.random()*unscramble(linked_sentence).length)];

  return linked_sentence[0]+' ' + linked_sentence[1]+' ' + linked_sentence[2]+' ' + linked_sentence[3]+' ' + linked_sentence[4]+' ' + linked_sentence[5]+' ' + linked_sentence[6];
}
/////// some simple text terms generated with random number and a 7 layer NN
///




function myTime() {
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    if (h<=12) return h + ':' + m + ' A.M.'
    else return h-12 + ':' + m + ' P.M.'
}

var p = document.getElementById('Poemlines');
if (typeof p !==null || typeof p !='undefined'){
  p.innerHTML = '';
  var epoch = 100;
  var learning_rate =0.14;
  var n = 0;
  var entropy_past_long = NN(Math.random()*onestep_sigmoid(Math.sin(Date.now())));
  var entropy_past = NN(Math.random()*onestep_sigmoid(Math.cos(Date.now())));
  var global_count =0;
  var Freq_ = Math.random()>0.4?'etaonrishd':'lfcmugypwb'; // same initializer for the first char
  var past_alpha= Freq_[Math.floor(Math.random()*Freq_.length)];
  past_alpha = alphabet_match(Train_NN(entropy_past_long,entropy_past,epoch, learning_rate),past_alpha,global_count);
  var str = "At "+myTime()+' ☕️ The AI says 👉🏼 "' + past_alpha.toUpperCase() + ' ';
  var ending = [' ',' ',' ','...',' !!',' ?','...?',' !','🍣','🌶','🍋','🍌','🦖','🦄','🐼','🐔','🐈','🌹','🌟','🍆'];
  var ending_add = ending[Math.floor(Math.random()*ending.length)];
  var str_middle = past_alpha;
  var name_register = str_middle;
  // three words output 
  for (var k =0; k<3; k++){
	for (var i =0; i<6; i++){
  		past_alpha=alphabet_match(Train_NN(entropy_past_long,entropy_past,epoch, learning_rate),past_alpha,global_count);
  		str_middle += past_alpha;
  		name_register += str_middle;
  	}
  	global_count =0;
  	str += ' ' + dict_relevance_NN(str_middle, data_dictionary, data_interlinks, k+1) + ' ';
  	entropy_past = 0.3*(Math.random()>0.5?entropy_past:NN(Math.random()*onestep_sigmoid(Math.cos(Date.now())))) + 0.7*entropy_past; // what remembered might not be the actual.
 	str_middle = past_alpha;
 	name_register += str_middle;
 	str += ',';
  }
  str = str.substring(0, str.length-1);
  str += ending_add;
  var text = document.getElementById('text_field');
  text.value = name_register;

  var typeTimer = setInterval(function() {
    n = n + 1;
    p.innerHTML = "" + str.slice(0, n);
    if (n === str.length) {
      clearInterval(typeTimer);
      p.innerHTML = "" + str;
      n = 0;
      setInterval(function() {

        if (n === 0) {
          p.innerHTML = "" + str + '_"';
          n = 1;
        } else {
          p.innerHTML = "" + str + '&nbsp;&nbsp;"';
          n = 0;
        };
      }, 800);
    };
}, 140);


}

function Train_NN(long_past ,past, epoch, learning_rate){
  var interation = 0;
  while (interation<epoch){
    var lstm_neuron = Math.random()>0.77?(Math.random()>0.5?long_past:NN(Math.random()*onestep_sigmoid(Math.sin(Date.now())))):past;
    past = 0.00107*lstm_neuron*(1+learning_rate)+0.559*past + 0.44*NN(Math.random()*onestep_sigmoid(Math.sin(Date.now())))*(1-0.08*learning_rate); //with heuristic cost
    interation++;
  }
  return past;  
}



function NN(value){
  var entropy_1 = entropy(value);
  entropy_1 = move_forward(entropy_1);
  entropy_1 = act_relu(entropy_1);
  var entropy_2 = cross_entropy(entropy_1);
  entropy_2 = move_forward(entropy_2);
  entropy_2 = act_relu(entropy_2);
  var entropy_3 = cross_entropy(entropy_2);
  entropy_3 = move_forward(entropy_3);
  entropy_3 = act_relu(entropy_3);
  var entropy_4 = cross_entropy(entropy_3);
  entropy_4 = move_forward(entropy_4);
  entropy_4 = act_relu(entropy_4);
  var entropy_5 = cross_entropy(entropy_4);
  entropy_5 = move_forward(entropy_5);
  entropy_5 = act_relu(entropy_5);
  var entropy_6 = cross_entropy(entropy_5);
  entropy_6 = move_forward(entropy_6);
  entropy_6 = act_relu(entropy_6);
  var entropy_7 = cross_entropy(entropy_6);
  entropy_7 = move_forward(entropy_7);
  entropy_7 = act_relu(entropy_7);
  entropy_7 = onestep_sigmoid(entropy_7);
  //
  entropy_6 = back_forward(entropy_6,entropy_7);
  entropy_5 = back_forward(entropy_5,entropy_6);
  entropy_4 = back_forward(entropy_4,entropy_5);
  entropy_3 = back_forward(entropy_3,entropy_4);
  entropy_2 = back_forward(entropy_2,entropy_3);
  entropy_1 = back_forward(entropy_1,entropy_2);


  return entropy_1*value;

}



function entropy(value){
  return -1*(value*Math.log(value));
}

function cross_entropy(value){
  return -1*(value*Math.log(value) + (1-value)*Math.log(value));
}

function onestep_sigmoid(value){
  return 1/(1+Math.exp(-1*value));
}

function move_forward(value){
  return Math.sqrt(2)*(Math.sin(value)+Math.cos(value))/2;
}

function back_forward(past_value,value){
  return past_value - 0.5*(past_value - value)*(past_value - value);
}

function act_relu(value){
  return Math.max(0,value);
}

function softplus(value){
  return Math.log(1+Math.exp(value));
}

function alphabet_match(value,past_char,count){
  var Freq_word = Math.random()>0.4?'etaonrishd':(Math.random()>0.3?'lfcmu':'gypwb');
  var Frea_combo = 'thareions';
  var Frea_combo_re = 'oihearntdsf';
  var Frea_double = 'lesotrnp';
  var item_1 = 'e';
  var item_2 = 'e';
  if (count < 1){
  
    if (Frea_combo.indexOf(past_char) > -1){
      var item_1 = Frea_combo_re[Math.floor(Math.random()*Frea_combo_re.length)];
    }
    if (Frea_double.indexOf(past_char) > -1){
      var item_2 = past_char;
    }
    else {
      var item_1 = Freq_word[Math.floor(Math.random()*Freq_word.length)];
      var item_2 = Freq_word[Math.floor(Math.random()*Freq_word.length)];
    }
    var temp_var = Math.random()>0.5?String.fromCharCode(parseInt(value*(0x007A-0x0061)+0x0061, 16).toString(16)):(Math.random()>0.5?item_1:item_2);
    if (temp_var==past_char) count++; 
    return temp_var; 
  }
  else if (count>=1){
    var temp_var = Math.random()>0.5?String.fromCharCode(parseInt(value*(0x007A-0x0061)+0x0061, 16).toString(16)):(Math.random()>0.5?item_1:item_2);
    while(temp_var==past_char){
      temp_var = Freq_word[Math.floor(Math.random()*Freq_word.length)]; // act as a correction
    }
    //count = 0;
    return temp_var;
  }
  else
    return '&nbsp;';
}

function indexOfMin(array) {
  var min = array[0];
  var minIndex = 0;
  for (var i = 1; i < array.length; i++) {
    if (array[i] < min && array[i]>=0) {
      minIndex +=1;
      min = array[i];
    }
  }
  return minIndex;
}

function indexOfMax(array) {
  var max = array[0];
  var maxIndex = 0;
  for (var i = 1; i < array.length; i++) {
    if (array[i] > max && array[i]>=0) {
      maxIndex +=1;
      max = array[i];
    }
  }
  return maxIndex;
}

},1600);

