window.onload=function(){
    var removeBtns = document.querySelectorAll('.removeBtn');
    for(var i = 0; i < removeBtns.length; i++){
        removeBtns[i].addEventListener('click', function(){
            this.parentNode.parentNode.remove();
            var numberInputs = document.querySelectorAll('input[type="number"');
            if(numberInputs.length == 1){
                numberInputs[0].parentNode.parentNode.remove();
                var weight = numberInputs[0].value;

                var submitBtn = document.getElementById('submitBtn');
                submitBtn.parentNode.removeChild(submitBtn);

                var newDiv = document.createElement('div');
                newDiv.classList.add("field");
        
                var newLabel = document.createElement('label');
                newLabel.setAttribute('for', 'weights[]');
                newLabel.textContent = "Weight";
        
                var newInput = document.createElement('input');
                newInput.setAttribute('type', 'number');
                newInput.setAttribute('name', 'weights[]');
                newInput.setAttribute('placeholder', 'Weight');
                newInput.setAttribute('value', weight);

                newDiv.appendChild(newLabel);
                newDiv.appendChild(newInput);
        
                document.getElementById("form").appendChild(newDiv);

                var newSubmit = document.createElement('input');
                newSubmit.setAttribute('type', 'submit');
                newSubmit.setAttribute('style', 'width: 100%; font-family: Lato, Helvetica;');
                newSubmit.setAttribute('value', 'EDIT QUESTION');
                newSubmit.classList.add('btn');
                newSubmit.classList.add('btn-secondary');
                newSubmit.classList.add('btn-lg');
        
                document.getElementById("form").appendChild(newSubmit);
            }
        });
    }
}