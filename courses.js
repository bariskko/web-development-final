// Fetch course data from the JSON file and store it in local storage
var data = fetch('./courses.json')
    .then(response => response.json())
    .then(data => {
        localStorage.setItem('courses', JSON.stringify(data));
});

// Retrieve course data from local storage and log it to the console
var coursesData = localStorage.getItem('courses');
console.log(coursesData);

// Retrieve course data from local storage as an array
var courses = localStorage.getItem('courses');
var coursesArray = JSON.parse(courses) || [];

// Create the initial table with course data
createTable(JSON.parse(localStorage.getItem("courses")));

// Event listener for adding a new course
var courseAddForm = document.getElementById("addCourseForm");
courseAddForm.addEventListener("submit", function(event) {
    event.preventDefault();

    var courseId = parseInt(document.getElementById("add-courseId").value);
    var courseName = document.getElementById("add-courseName").value;
    var gradingScale = document.getElementById("gradingScale").value;
    var credits = parseInt(document.getElementById("add-credits").value);

    var oldData = coursesArray;

    // Check if oldData is an array before pushing the new course
    if (Array.isArray(oldData)) {
        oldData.push({
            courseId: courseId,
            courseName: courseName,
            gradingScale: gradingScale,
            credits: credits
        });
        localStorage.setItem("courses", JSON.stringify(oldData));
        createTable(oldData);
    } else {
        console.log("coursesArray is not an array.");
    }
});

// Event listener for updating a course
var updateCourseForm = document.getElementById("updateCourseForm");
updateCourseForm.addEventListener("submit", function(event) {
    event.preventDefault();

    var courseId = parseInt(document.getElementById("update-courseId").value);
    var courseName = document.getElementById("update-courseName").value;
    var gradingScale = document.getElementById("update-gradingScale").value;
    var credits = parseInt(document.getElementById("update-credits").value);

    var oldData = JSON.parse(localStorage.getItem("courses"));
    for (let i = 0; i < oldData.length; i++) {
        if (oldData[i].courseId == courseId) {
            oldData[i].courseName = courseName;
            oldData[i].gradingScale = gradingScale;
            oldData[i].credits = credits;
        }
    }
    localStorage.setItem("courses", JSON.stringify(oldData));
    createTable(JSON.parse(localStorage.getItem("courses")));
});

// Event listener for deleting a course
var deleteCourseForm = document.getElementById("deleteCourseForm");
deleteCourseForm.addEventListener("submit", function(event) {
    event.preventDefault();
    var courseId = parseInt(document.getElementById("delete-courseId").value);

    var oldData = coursesArray;

    // Check if oldData is an array before deleting the course
    if (Array.isArray(oldData)) {
        const index = oldData.findIndex(course => course.courseId === courseId);
        if (index !== -1) {
            oldData.splice(index, 1);
            console.log(`Course with ID ${courseId} is deleted.`);
        } else {
            console.log(`Course with ID ${courseId} is not found.`);
        }
        localStorage.setItem("courses", JSON.stringify(oldData));
        createTable(oldData);
    } else {
        console.log("coursesArray is not an array.");
    }
});

// Log the courses to the console
console.log(courses);

// Create the table with course data
function createTable(courses) {
    var tableDiv = document.getElementById("courses-table");
    tableDiv.innerHTML = "";
    var coursesTable = document.createElement("table");
    coursesTable.innerHTML +=
        "<tr>" +
        "<td>" + "Course ID" + "</td>" +
        "<td>" + "Course Name" + "</td>" +
        "<td>" + "Grading Scale" + "</td>" +
        "<td>" + "Credits" + "</td>" +
        "</tr>";

    for (let i = 0; i < courses.length; i++) {
        console.log(courses);
        var newRow = coursesTable.insertRow();

        var courseIdCell = newRow.insertCell(0);
        courseIdCell.innerHTML = courses[i].courseId;

        var courseNameCell = newRow.insertCell(1);
        courseNameCell.innerHTML = courses[i].courseName;

        var gradingScaleCell = newRow.insertCell(2);
        gradingScaleCell.innerHTML = courses[i].gradingScale;

        var creditsCell = newRow.insertCell(3);
        creditsCell.innerHTML = courses[i].credits;
    }

    // Append the table to the HTML element
    tableDiv.appendChild(coursesTable);
}
