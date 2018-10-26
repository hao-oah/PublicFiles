

////////////////// D3 JS /////////
/* ========================================================================
 * Real-time word synthetics v1.0
 * Performance Depends on device.
 * http://www.honesthao.cf
 * ========================================================================
 * Concept & Design (c) Hao
 * 1044504787@qq.com
 * ======================================================================== */

setTimeout(function(){

var locationreload = getElementById('locationreload');


var words_atlas = ['this','collection','of','words','is','a','simple','one','but','its',
                  'sole','purpose','is','to','take','you','on','a','chronological','journey',
                  'of','words','while','making','you','uncomfortably','selfaware','i','feel',
                  'like','this','belongs','somewhere','in','the','matrix'];
var data_dictionary;
  d3.csv("https://rawcdn.githack.com/hao-oah/PublicFiles/master/Abalone.csv", function(data) {
    data_dictionary = data;// d3 async nature.
  });
var data_interlinks;
  d3.json("https://cdn.rawgit.com/hao-oah/PublicFiles/master/common_words.json", function(data) {
    data_interlinks = data;// d3 async nature.
  });

/////// some simple text terms generated with random number and a 7 layer NN
///
locationreload.onclick = function(){
/////// Initialization

  var p = document.getElementById('Poemlines');
  // section flag

  p.innerHTML = 'S y n t h e s i z i n g . . . (1/2)🚦';

  setTimeout(function(){

    if (typeof p !==null || typeof p !='undefined'){
    p.innerHTML = '';
    var N_layers = 477;
    var Number_of_words = Math.random()>0.5?5:(Math.random()>0.5?4:3);// Number of words to be syntheized (avg. 4.79)
    var Temperature = -12*Math.exp(Math.exp(Math.exp(Math.exp(Math.PI*9007199254740991)))); // probability theory
    var epoch = 100;
    var learning_rate =0.14;
    var n = 0;
    var entropy_past_long = NN(Math.random()*onestep_sigmoid(Math.sin(Date.now())), N_layers, Temperature);
    var entropy_past = NN(Math.random()*onestep_sigmoid(Math.cos(Date.now())), N_layers, Temperature);
    var global_count =0;
    var text = document.getElementById('text_field'); // hold text transfer

    // initialize past_alpha with : exact entropy from NN

    var past_alpha= String.fromCharCode(parseInt(entropy_past*(0x007A-0x0061)+0x0061, 16).toString(16));
    past_alpha = Math.random()>0.5?past_alpha:alphabet_match(Train_NN(entropy_past_long,entropy_past,epoch, learning_rate, N_layers, Temperature),past_alpha,global_count);
    var str = "At "+myTime()+' ☕️ The AI says 👉🏼 "' + past_alpha.toUpperCase() + ' ';
    var ending = [' ',' ',' ','. . .',' ! !',' ?','. . . ?',' !','🍣','🌶','🍋','🍌','🦖','🦄','🐼','🐔','🐈','🌹','🌟','🍆'];
    var ending_add = ending[Math.floor(Math.random()*ending.length)];
    var str_middle = past_alpha;
    var name_register = str_middle;
    // three words output 
    for (var k =0; k<Number_of_words; k++){ // Number of words to be syntheized

      for (var i =0; i<6; i++){
        past_alpha=alphabet_match(Train_NN(entropy_past_long,entropy_past,epoch, learning_rate, N_layers, Temperature),past_alpha,global_count);
        str_middle += past_alpha;
        name_register += str_middle;
      }
      global_count =0;
      str += ' ' + dict_relevance_NN(str_middle, data_dictionary, data_interlinks, k+1, N_layers, Temperature) + ' ';
      entropy_past = 0.3*(Math.random()>0.5?entropy_past:NN(Math.random()*onestep_sigmoid(Math.cos(Date.now())), N_layers, Temperature)) + 0.7*entropy_past; // what remembered might not be the actual.

      str_middle = past_alpha;
      name_register += str_middle;
      str += '­­ ' + '­­ ' + '­­ ';
    }
    str = str.substring(0, str.length-3);
    str += ending_add;

    text.value = str; // text is the holder of the input transfer in front
    if (!!document.getElementById('interlink_button') && str.length > 1) document.getElementById('interlink_button').style.visibility = 'visible';
    if (!!document.getElementById('locationreload') && str.length > 1) document.getElementById('locationreload').style.display = 'none';
    //typeTimer is declared as global var to clean run

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
        }, 400);
      };
    }, 110);
  } // end of the sampling program./ 


},4000);} // end of clicking event. 


 // end of window

// The Biggest Network in this example to calculate the strings

function dict_relevance_NN(str, obj, links, N, N_layers, Temperature){ // N is a seq flag which determines which section it runs.
  var book=[''];
  var sample ='';
  var sample_book ='';
  var sample_entropy = 0;
  var global_count =0;
  var relevent_sentence ='';
  var linked_sentence ='';
  var sorted_sentence ='';
  var residue_sentence = '';
  var Levenshtein_dist = [];

  for (var i=0;i<obj.length;i++){
    if(obj[i].Abalone[0]==str[0]) book.push(obj[i].Abalone); // use the beginning as the logic anchor
  }
  sample_book = book[Math.floor(Math.random()*book.length)];  
  for(i=0;i<7;i++){
    relevent_sentence+=alphabet_match(Train_NN((sample_book[i]-0x0061)/(0x007A-0x0061),(str[i]-0x0061)/(0x007A-0x0061),1000, 0.12, N_layers, Temperature),str[i],global_count)  
  }
  global_count =0;
  sample = links[Math.floor(Math.random()*links.length)].word;  // dataset load
  //sample = sample_book; // the link data is not rich enough for now, generates high bias.
  for(i=7*(N-1);i<7*N;i++){
    linked_sentence+=alphabet_match(Train_NN((sample[i]-0x0061)/(0x007A-0x0061),(relevent_sentence[i]-0x0061)/(0x007A-0x0061),1000, 0.001, N_layers, Temperature),relevent_sentence[i],global_count)  // lower for now to avoid overfitting
  }
  global_count =0;
  if (unscramble(linked_sentence,words_atlas)[0] != 'No results found.')
    linked_sentence = unscramble(linked_sentence,words_atlas)[0];
  else{
    for(i=7*(N-1);i<7*N;i++){
      sorted_sentence+=alphabet_match(Train_NN((sample_book[i]-0x0061)/(0x007A-0x0061),(relevent_sentence[i]-0x0061)/(0x007A-0x0061),400, 0.07, N_layers, Temperature),linked_sentence[i],global_count)  // lower for now to avoid overfitting
    }
    global_count =0;
    if (unscramble(sorted_sentence,words_atlas)[0] != 'No results found.'){
      sorted_sentence = unscramble(sorted_sentence,words_atlas)[0];
      linked_sentence = sorted_sentence;
      }
    else{
      for(i=7*(N-1);i<7*N;i++){
        residue_sentence+=alphabet_match(Train_NN((sample_book[i]-0x0061)/(0x007A-0x0061),(sorted_sentence[i]-0x0061)/(0x007A-0x0061),200, 0.07, N_layers, Temperature),sorted_sentence[i],global_count)  // lower for now to avoid overfitting
      }
      global_count =0;
      if (unscramble(residue_sentence,words_atlas)[0] != 'No results found.'){
        residue_sentence = unscramble(residue_sentence,words_atlas)[0];
        linked_sentence = residue_sentence;
      }
      else linked_sentence = sorted_sentence;
    }

  }
  // implementation of Levenshtein:
  // testcase: obj array 

  for (var Li=0;Li<links.length;Li++){Levenshtein_dist.push(linked_sentence.levenstein(links[Li].word));}
  linked_sentence = links[indexOfMin(Levenshtein_dist)].word;
  
  residue_sentence = '';
  for(var LL = 0; LL < linked_sentence.length; LL++){
    residue_sentence += (linked_sentence[LL]+' ');
  }

  return residue_sentence;
}

// medium sized network of this example to handle simple corrections. 

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

function Train_NN(long_past ,past, epoch, learning_rate, N_layers, Temperature){
  var interation = 0;
  var dropout_1 = 0;
  var dropout_2 = 0;
  var dropout_3 = 0;
  while (interation<epoch){
    var lstm_neuron = Math.random()>0.77?(Math.random()>0.5?long_past:NN(Math.random()*onestep_sigmoid(Math.sin(Date.now())), N_layers, Temperature)):past;
    past = 0.00107*lstm_neuron*(1+learning_rate)*dropout_1+0.559*past*dropout_2 + 0.44*NN(Math.random()*onestep_sigmoid(Math.sin(Date.now())), N_layers, Temperature)*(1-0.08*learning_rate)*dropout_3; //with heuristic cost
    dropout_1  = Math.random()>0.87?1:0;
    dropout_2  = Math.random()>0.87?1:0;
    dropout_3  = Math.random()>0.87?1:0;
    interation++;
  }
  return past;  
}


function NN(value, N , T){ // N: number of layers | T : Temperature

  var entropy_temp = this.value;
  var entropy_previous = [];
  var x = this.value; // 1/x gradient decline.
  var T = this.T; // temperature

  for (var i=0; i<N; i++){ // forward propagation.
    entropy_previous.push(entropy_temp);
    entropy_temp = act_relu(move_forward(entropy(entropy_temp)));

  }
  entropy_temp = onestep_sigmoid(entropy_temp);
  entropy_previous.push(entropy_temp);
  for (var i=0; i<N; i++){
    entropy_previous[N-1 - i] = back_forward(entropy_previous[N-1 - i],entropy_previous[N - i],x_exp(x)*Tplus(T));
  }

  return softmax(entropy_previous[0],value)*(Math.random()>0.89?value:(1-value));

}


function myTime() {
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    if (h<=12) return h + ':' + m + ' A.M.'
    else return h-12 + ':' + m + ' P.M.'
}


function Tplus(value){
  value = value+1;
  return value;

}

function Tsub(value){
  value = 5*value/7;
  return value;

}

function x_exp(value){
  value = Math.exp(value+0.01); // manual gradient correction
  return value;
}

function array_exp(vector, total){ //
  total =0;
  for(var i=0; i<vector.length; i++){
    vector[i] = Math.exp(vector[i]);
    total += vector[i];
  }
  return vector;
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

function back_forward(past_value,value,x){
  return past_value * Math.exp(1/x) - Math.sqrt(0.5)*(past_value - value)*(past_value + value);
}

function act_relu(value){
  return Math.max(0,value);
}

function softplus(value){
  return Math.log(1+Math.exp(value));
}

function softmax(value, input) {
  var total;
  const exponents = array_exp(value, total);
  return Math.exp(value) / total;
}

function indexOfMin(array) {
  var min = array[0];
  var minIndex = 0;
  for (var i = 1; i < array.length; i++) {
    if (array[i] < min) {
      minIndex =i;
      min = array[i];
    }
  }
  return minIndex;
}

function indexOfMax(array) {
  var max = array[0];
  var maxIndex = 0;
  for (var i = 1; i < array.length; i++) {
    if (array[i] > max) {
      maxIndex =i;
      max = array[i];
    }
  }
  return maxIndex;
}

function unscramble(word,words_atlas){

  word = word.toLowerCase();
  var matches = [];
  var sortedWord = word.split('').sort().join('');
  words_atlas.forEach(function(x){
    if(matches.length >= 30) return;
    
    if (sortedWord.length == x.length || sortedWord.substring(0, sortedWord.length-1).length == x.length) {
      var x2 = x.split('').sort().join('');
      if (sortedWord == x2 || sortedWord.substring(0, sortedWord.length-1) == x2) {
        matches.push(x);
      }
    }
  });
  
  if(matches.length == 0) matches = ["No results found."];
  
  return matches;

}

String.prototype.shuffle = function () {
    var a = this.split(''),
        n = a.length;

    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join('');
}

String.prototype.levenstein = function(string) {
    var a = this, 
        b = string + "", 
        m = [], 
        i, 
        j, 
        min = Math.min;

    if (!(a && b)) return (b || a).length;

    for (i = 0; i <= b.length; m[i] = [i++]);
    for (j = 0; j <= a.length; m[0][j] = j++);

    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            m[i][j] = b.charAt(i - 1) == a.charAt(j - 1)?m[i - 1][j - 1]: m[i][j] = min(m[i - 1][j - 1] + 1, min(m[i][j - 1] + 1, m[i - 1 ][j] + 1))
        }
    }

    return m[b.length][a.length];
}



},800); // load doc a bit later