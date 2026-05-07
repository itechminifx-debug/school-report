// ==================== SHARED DATABASE SYSTEM ====================
// This file manages all data in a central JSON file on the server

var Database = {
    // The URL where the database file is stored
    dataUrl: '/shared_data.json',
    
    // Cache of current data
    data: {
        students: [],
        teachers: [
            { title: 'Mr.', name: 'Mensah', password: '1234' },
            { title: 'Mrs.', name: 'Appiah', password: '1234' },
            { title: 'Mr.', name: 'Osei', password: '1234' },
            { title: 'Ms.', name: 'Asante', password: '1234' },
            { title: 'Mr.', name: 'Boadu', password: '1234' }
        ]
    },
    
    // Load data from server
    load: async function() {
        try {
            var response = await fetch(this.dataUrl);
            if (response.ok) {
                this.data = await response.json();
                return true;
            }
        } catch (e) {
            console.log('Could not load from server, using cache');
        }
        return false;
    },
    
    // Save data to server
    save: async function() {
        try {
            var response = await fetch(this.dataUrl, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.data)
            });
            return response.ok;
        } catch (e) {
            console.log('Save to server failed:', e.message);
            // Fallback: save to localStorage
            this.saveLocal();
            return false;
        }
    },
    
    // Fallback: save to localStorage
    saveLocal: function() {
        localStorage.setItem('admin_students', JSON.stringify(this.data.students));
        localStorage.setItem('admin_teachers', JSON.stringify(this.data.teachers));
    },
    
    // Fallback: load from localStorage
    loadLocal: function() {
        var savedStudents = localStorage.getItem('admin_students');
        var savedTeachers = localStorage.getItem('admin_teachers');
        if (savedStudents) this.data.students = JSON.parse(savedStudents);
        if (savedTeachers) this.data.teachers = JSON.parse(savedTeachers);
    },
    
    // Get all students
    getStudents: function() {
        return this.data.students;
    },
    
    // Get all teachers
    getTeachers: function() {
        return this.data.teachers;
    },
    
    // Add a student
    addStudent: async function(student) {
        this.data.students.push(student);
        await this.save();
        this.saveLocal();
    },
    
    // Delete a student
    deleteStudent: async function(id) {
        this.data.students = this.data.students.filter(function(s) { return s.id !== id; });
        await this.save();
        this.saveLocal();
    },
    
    // Add a teacher
    addTeacher: async function(teacher) {
        this.data.teachers.push(teacher);
        await this.save();
        this.saveLocal();
    },
    
    // Delete a teacher
    deleteTeacher: async function(index) {
        this.data.teachers.splice(index, 1);
        await this.save();
        this.saveLocal();
    }
};