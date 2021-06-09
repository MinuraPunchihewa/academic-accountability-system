window.onload=function(){
    document.getElementById("faculty").addEventListener("change", function(){
        var selectHTML = "";

        var S = ["Department of Botany", "Department of Chemistry", "Department of Industrial Management", "Department of Mathematics", "Department of Microbiology", "Department of Physics", "Department of Statistics & Computer Science", "Department of Zoology & Enviornmental Management"];
        var H = ["Department of English", "Department of English Language Teaching", "Department of Fine Arts", "Department of Hindi Studies", "Department of Linguistics", "Department of Modern Languages", "Department of Pali & Buddhist Studies", "Department of Sanskrit and Eastern Studies", "Department of Sinhala", "Department of Western Classical Culture & Christian Culture"];
        var SS = ["Department of Archaelogy", "Department of Economics", "Department Geography", "Department of History", "Department of International Studies", "Department of Library and Information Science", "Department of Mass Communication", "Department of Philosophy", "Department of Political Science", "Department of Sociology", "Department of Social Statistics", "Department of Sports Science and Physical Education"];

        
        if (document.getElementById("faculty").value == "Faculty of Science") {

            document.getElementById("department").innerHTML = "";

            for (var i = 0; i < S.length; i++) {
                var newSelect = document.createElement('option');
                selectHTML = "<option value='" + S[i] + "'>" + S[i] + "</option>";
                newSelect.innerHTML = selectHTML;
                document.getElementById("department").add(newSelect);
            }
        }

        else if (document.getElementById("faculty").value == "Faculty of Humanities") {

            document.getElementById("department").innerHTML = "";

            for (var i = 0; i < H.length; i++) {
                var newSelect = document.createElement('option');
                selectHTML = "<option value='" + H[i] + "'>" + H[i] + "</option>";
                newSelect.innerHTML = selectHTML;
                document.getElementById("department").add(newSelect);
            }
        }

        else if (document.getElementById("faculty").value == "Faculty of Social Sciences") {

            document.getElementById("department").innerHTML = "";

            for (var i = 0; i < SS.length; i++) {
                var newSelect = document.createElement('option');
                selectHTML = "<option value='" + SS[i] + "'>" + SS[i] + "</option>";
                newSelect.innerHTML = selectHTML;
                document.getElementById("department").add(newSelect);
            }
        }

    });
}
