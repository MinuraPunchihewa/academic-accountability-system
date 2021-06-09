window.onload=function(){
    document.getElementById("no").addEventListener("click", function(){
        var newDiv = document.createElement('div');
        newDiv.classList.add("field");

        var newLabel = document.createElement('label');
        newLabel.setAttribute('for', 'weight');
        newLabel.textContent = "Weight";

        var newInput = document.createElement('input');
        newInput.setAttribute('type', 'number');
        newInput.setAttribute('name', 'weight');
        newInput.setAttribute('placeholder', 'Weight');
        // newInput.setAttribute('required');

        newDiv.appendChild(newLabel);
        newDiv.appendChild(newInput);

        document.getElementById("form").appendChild(newDiv);

        var newSubmit = document.createElement('input');
        newSubmit.setAttribute('type', 'submit');
        newSubmit.setAttribute('style', 'width: 100%; font-family: Lato, Helvetica;');
        newSubmit.setAttribute('value', 'CREATE QUESTION');
        newSubmit.classList.add('btn');
        newSubmit.classList.add('btn-secondary');
        newSubmit.classList.add('btn-lg');

        document.getElementById("form").appendChild(newSubmit);
    });

    document.getElementById("yes").addEventListener("click", function(){
        var newDiv = document.createElement('div');
        newDiv.classList.add("field");
        
        var newLabel = document.createElement('label');
        newLabel.setAttribute('for', 'numOptions');
        newLabel.textContent = "Number Of Options";

        var newInput = document.createElement('input');
        newInput.setAttribute('type', 'number');
        newInput.setAttribute('id', 'numOptions');
        newInput.setAttribute('name', 'numOptions');
        newInput.setAttribute('placeholder', 'Number Of Options');
        newInput.setAttribute('style', 'display: inline; width: 92%');
        // newInput.setAttribute('required');

        var newButton = document.createElement('button');
        newButton.textContent = "Set";
        newButton.addEventListener("click", function(){
            var numOptions = document.getElementById('numOptions').value;
            console.log(numOptions);
            for(var i = 1; i <= numOptions; i++){
                var newDivOption = document.createElement('div');
                newDivOption.classList.add("field");
                var newDivWeight = document.createElement('div');
                newDivWeight.classList.add("field");

                var newLabelOption = document.createElement('label');
                newLabelOption.setAttribute('for', 'option' + i);
                newLabelOption.textContent = "Option " + i ;

                var newInputOption = document.createElement('input');
                newInputOption.setAttribute('type', 'text');
                newInputOption.setAttribute('name', 'optionTexts[]');
                newInputOption.setAttribute('placeholder', 'Option ' + i);

                var newLabelWeight = document.createElement('label');
                newLabelWeight.setAttribute('for', 'weight' + i);
                newLabelWeight.textContent = "Weight For Option " + i;

                var newInputWeight = document.createElement('input');
                newInputWeight.setAttribute('type', 'number');
                newInputWeight.setAttribute('name', 'weights[]');
                newInputWeight.setAttribute('placeholder', 'Weight');

                newDivOption.appendChild(newLabelOption);
                newDivOption.appendChild(newInputOption);
                newDivWeight.appendChild(newLabelWeight);
                newDivWeight.appendChild(newInputWeight);
        
                document.getElementById("form").appendChild(newDivOption);
                document.getElementById("form").appendChild(newDivWeight);
            }
            var newSubmit = document.createElement('input');
            newSubmit.setAttribute('type', 'submit');
            newSubmit.setAttribute('style', 'width: 100%; font-family: Lato, Helvetica;');
            newSubmit.setAttribute('value', 'CREATE QUESTION');
            newSubmit.classList.add('btn');
            newSubmit.classList.add('btn-secondary');
            newSubmit.classList.add('btn-lg');
    
            document.getElementById("form").appendChild(newSubmit);
        });
        newButton.setAttribute('style', 'display: inline; height: 38px; width: 49px;');
        newButton.setAttribute('type', 'button');
        newButton.setAttribute('id', 'setBtn');
        newButton.classList.add('ml-1');
        newButton.classList.add('btn');
        newButton.classList.add('btn-secondary');
        newButton.classList.add('btn-md');

        newDiv.appendChild(newLabel);
        newDiv.appendChild(newInput);

        newDiv.appendChild(newLabel);
        newDiv.appendChild(newInput);
        newDiv.appendChild(newButton);

        document.getElementById("form").appendChild(newDiv);
    });

    var multiplier = document.getElementById('multiplier');
    multiplier.addEventListener('change', function(){
        if(multiplier.value == "No. of"){
            var newLabel            = document.createElement('label');
            newLabel.textContent    = "No. of?";
            newLabel.setAttribute('for', 'noOfMultiplier');
            newLabel.classList.add('mt-2');
            var newInput            = document.createElement('input');
            newInput.setAttribute('type', 'text');
            newInput.setAttribute('name', 'noOfMultiplier');
            newInput.setAttribute('placeholder', 'No. of?')

            var multiplierField     = document.getElementById('multiplierField');
            multiplierField.appendChild(newLabel);
            multiplierField.appendChild(newInput);
        }
        if(multiplier.value == "Yes/No"){
            var newDivWeightYes = document.createElement('div');
            newDivWeightYes.classList.add("field");

            var newDivWeightNo = document.createElement('div');
            newDivWeightNo.classList.add("field");
            
            var newLabelWeightYes = document.createElement('label');
            newLabelWeightYes.setAttribute('for', 'weights[]');
            newLabelWeightYes.textContent = "Weight For 'Yes'";

            var newInputWeightYes = document.createElement('input');
            newInputWeightYes.setAttribute('type', 'number');
            newInputWeightYes.setAttribute('name', 'weights[]');
            newInputWeightYes.setAttribute('placeholder', "Weight For 'Yes'");

            var newLabelWeightNo = document.createElement('label');
            newLabelWeightNo.setAttribute('for', 'weights[]');
            newLabelWeightNo.textContent = "Weight For 'No'";

            var newInputWeightNo = document.createElement('input');
            newInputWeightNo.setAttribute('type', 'number');
            newInputWeightNo.setAttribute('name', 'weights[]');
            newInputWeightNo.setAttribute('placeholder', "Weight For 'No'");

            newDivWeightYes.appendChild(newLabelWeightYes);
            newDivWeightYes.appendChild(newInputWeightYes);

            newDivWeightNo.appendChild(newLabelWeightNo);
            newDivWeightNo.appendChild(newInputWeightNo);

            var optionsField = document.getElementById('optionsField');
            optionsField.parentNode.removeChild(optionsField);
            
            var newSubmit = document.createElement('input');
            newSubmit.setAttribute('type', 'submit');
            newSubmit.setAttribute('style', 'width: 100%; font-family: Lato, Helvetica;');
            newSubmit.setAttribute('value', 'CREATE QUESTION');
            newSubmit.classList.add('btn');
            newSubmit.classList.add('btn-secondary');
            newSubmit.classList.add('btn-lg');

            var form = document.getElementById("form");
            form.appendChild(newDivWeightYes);
            form.appendChild(newDivWeightNo);
            form.appendChild(newSubmit);
        }
    });
}


