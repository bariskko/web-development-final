// Fetch student data from the JSON file and store it in local storage
var data = fetch('./students.json')
    .then(response => response.json())
    .then(data => {
        localStorage.setItem('students', JSON.stringify(data));
});

// Create the initial table with student data
createTable(JSON.parse(localStorage.getItem("students")));

// Calculate and display GPA for a specific student (for example, student with ID 100001)
calculateStudentGPA(100001);

// Event listener for adding a new student
var studentAddForm = document.getElementById("addStudentForm");
studentAddForm.addEventListener("submit", function(event) {
    event.preventDefault();

    var studentId = parseInt(document.getElementById("add-studentId").value);
    var name = document.getElementById("add-studentName").value;
    var surname = document.getElementById("add-studentSurname").value;

    // Add the new student to the local storage
    var oldData = JSON.parse(localStorage.getItem("students"));
    oldData.push({
        studentId: studentId,
        studentName: name,
        studentSurname: surname,
        courses: []
    });
    localStorage.setItem("students", JSON.stringify(oldData));

    // Update the table with the new student data
    createTable(JSON.parse(localStorage.getItem("students")));
});

// Event listener for adding a course to a student
var addCourseToStudent = document.getElementById("addCourseToStudent");
addCourseToStudent.addEventListener("submit", function(event) {
    event.preventDefault();
    var studentId = parseInt(document.getElementById("add-CourseToStudent").value);
    var course = document.getElementById("addCourse").value;
    course = course.split(',').map(Number);

    // Add the course to the specified student in local storage
    var oldData = JSON.parse(localStorage.getItem("students"));
    for (let i = 0; i < oldData.length; i++) {
        if (oldData[i].studentId == studentId) {
            oldData[i].courses.push(course);
        }
    }
    localStorage.setItem("students", JSON.stringify(oldData));

    // Update the table with the modified student data
    createTable(JSON.parse(localStorage.getItem("students")));
});

// Event listener for updating a student's information
var updateStudentForm = document.getElementById("updateStudentForm");
updateStudentForm.addEventListener("submit", function(event) {
    event.preventDefault();

    var studentId = parseInt(document.getElementById("update-studentId").value);
    var name = document.getElementById("update-studentName").value;
    var surname = document.getElementById("update-studentSurname").value;

    // Update the information of the specified student in local storage
    var oldData = JSON.parse(localStorage.getItem("students"));
    for (let i = 0; i < oldData.length; i++) {
        if (oldData[i].studentId == studentId) {
            oldData[i].studentName = name;
            oldData[i].studentSurname = surname;
        }
    }
    localStorage.setItem("students", JSON.stringify(oldData));

    // Update the table with the modified student data
    createTable(JSON.parse(localStorage.getItem("students")));
});

// Event listener for deleting a student
var deleteStudentForm = document.getElementById("deleteStudentForm");
deleteStudentForm.addEventListener("submit", function(event) {
    event.preventDefault();
    var studentId = parseInt(document.getElementById("delete-studentId").value);

    // Delete the specified student from local storage
    var oldData = JSON.parse(localStorage.getItem("students"));
    const index = oldData.findIndex(student => student.studentId === studentId);
    if (index !== -1) {
        oldData.splice(index, 1);
        console.log(`Student with ID ${studentId} is deleted.`);
    } else {
        console.log(`Student with ID ${studentId} is not found.`);
    }
    localStorage.setItem("students", JSON.stringify(oldData));

    // Update the table with the modified student data
    createTable(JSON.parse(localStorage.getItem("students")));
});

// Event listener for searching students by name
var searchStudentByNameForm = document.getElementById("searchStudentByNameForm");
searchStudentByNameForm.addEventListener("submit", function(event) {
    event.preventDefault();
    var studentName = document.getElementById("searchStudentByName").value;
    var result = [];
    var oldData = JSON.parse(localStorage.getItem("students"));

    // Search for students with the specified name
    for (let i = 0; i < oldData.length; i++) {
        if (oldData[i].studentName === studentName) {
            result.push(oldData[i]);
        }
    }

    // Update the table with the search results
    createTable(result);
});

// Calculate the GPA for the specified student ID
function calculateStudentGPA(studentId) {
    var student = undefined;
    var coursesDb = JSON.parse(localStorage.getItem("courses"));

    // Find the student in local storage
    var oldData = JSON.parse(localStorage.getItem("students"));
    for (let i = 0; i < oldData.length; i++) {
        if (oldData[i].studentId === studentId) {
            student = oldData[i];
            break; // Öğrenci bulundu, döngüyü sonlandır
        }
    }

    if (!student) {
        console.error("Student not found with ID:", studentId);
        return 0; // Öğrenci bulunamazsa GPA sıfır olmalıdır (ya da başka bir değer)
    }

    var letterScores = [];
    for (let j = 0; j < student.courses.length; j++) {
        var foundCourse = coursesDb.find(course => course.courseId === student.courses[j][0]);
        if (foundCourse) {
            var averageScore = getCourseAveragePoint(student.courses[j]);
            if (foundCourse.gradingScale === 10) {
                letterScores.push(getLetterScale10(averageScore));
            } else {
                letterScores.push(getLetterScale7(averageScore));
            }
        } else {
            console.error("Course not found with ID:", student.courses[j][0]);
        }
    }

    var totalWeightGrade = 0;
    for (let i = 0; i < Math.min(letterScores.length, student.courses.length); i++) {
        switch (letterScores[i]) {
            case 'AA':
                totalWeightGrade += 4.0 * student.courses[i][3]; // Assuming acts is at index 3
                break;
            case 'BA':
                totalWeightGrade += 3.5 * student.courses[i][3];
                break;
            case 'BB':
                totalWeightGrade += 3.0 * student.courses[i][3];
                break;
            case 'CB':
                totalWeightGrade += 2.5 * student.courses[i][3];
                break;
            case 'CC':
                totalWeightGrade += 2.0 * student.courses[i][3];
                break;
            case 'DC':
                totalWeightGrade += 1.5 * student.courses[i][3];
                break;
            case 'DD':
                totalWeightGrade += 1.0 * student.courses[i][3];
                break;
            default:
                totalWeightGrade += 0.0 * student.courses[i][3];
                break;
        }
    }

    return totalWeightGrade;
}




// Get course information by course ID
function getCourseById(courseId) {
    var coursesDb = JSON.parse(localStorage.getItem("courses")).courses;
    for (let i = 0; i < coursesDb.length; i++) {
        if (courseId === coursesDb[i].courseId) {
            return coursesDb[i];
        }
    }
}

// Get letter grade based on a 10-point scale
function getLetterScale10(averageScore) {
    if (averageScore > 90) {
        return "AA";
    } else if (averageScore > 80) {
        return "BB";
    } else if (averageScore > 70) {
        return "CC";
    } else if (averageScore > 60) {
        return "DD";
    } else {
        return "FF";
    }
}

// Get letter grade based on a 7-point scale
function getLetterScale7(averageScore) {
    if (averageScore > 93) {
        return "AA";
    } else if (averageScore > 86) {
        return "BB";
    } else if (averageScore > 79) {
        return "CC";
    } else if (averageScore > 72) {
        return "DD";
    } else {
        return "FF";
    }
}

// Calculate the average point for a course
function getCourseAveragePoint(course) {
    var result = course[1] * 0.4 + course[2] * 0.6;
    return result;
}

// Create the table with student data
function createTable(students) {
    var tableDiv = document.getElementById("students-table");
    tableDiv.innerHTML = "";
    var studentsTable = document.createElement("table");
    studentsTable.innerHTML +=
        "<tr>" +
        "<td>" + "Student ID" + "</td>" +
        "<td>" + "Name" + "</td>" +
        "<td>" + "Surname" + "</td>" +
        "<td>" + "Courses" + "</td>" +
        "<td>" + "GPA" + "</td>" +  
        "</tr>";

    for (let i = 0; i < students.length; i++) {
        var newRow = studentsTable.insertRow();

        var studentIdCell = newRow.insertCell(0);
        studentIdCell.innerHTML = students[i].studentId;

        var studentNameCell = newRow.insertCell(1);
        studentNameCell.innerHTML = students[i].studentName;

        var studentSurnameCell = newRow.insertCell(2);
        studentSurnameCell.innerHTML = students[i].studentSurname;

        var takenCourses = [];
        for (let j = 0; j < students[i].courses.length; j++) {
            takenCourses.push(students[i].courses[j][0]);
        }

        var coursesCell = newRow.insertCell(3);
        coursesCell.innerHTML = takenCourses;

        // Calculate the GPA for the student and add it to the new column
        var gpaCell = newRow.insertCell(4);
        gpaCell.innerHTML = calculateStudentGPA(students[i].studentId);//273. satır
    }

    // Append the table to the HTML element
    tableDiv.appendChild(studentsTable);
}
