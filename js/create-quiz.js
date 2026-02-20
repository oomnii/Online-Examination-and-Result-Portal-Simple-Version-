// Quiz Creation Platform
// Allows users to manually create quizzes that integrate with the exam system

(function(){
  function $(id){ return document.getElementById(id); }

  let currentQuestionOptions = [];
  let addedQuestions = [];

  document.addEventListener('DOMContentLoaded', () => {
    if(!$('questionText') || !$('optionsInput')) return;

    if(typeof requireLogin === 'function') requireLogin();

    // Initialize with 4 default options
    initializeOptions(4);
    loadSavedQuizzes();

    // Store reference to window for onclick attributes
    window.addOption = addOption;
    window.removeOption = removeOption;
    window.addQuestion = addQuestion;
    window.clearForm = clearForm;
    window.saveQuiz = saveQuiz;
    window.exportQuiz = exportQuiz;
    window.deleteQuestion = deleteQuestion;
    window.playCustomQuiz = playCustomQuiz;
    window.deleteQuiz = deleteQuiz;
    window.goBack = goBack;
  });

  function initializeOptions(count) {
    currentQuestionOptions = [];
    const container = $('optionsInput');
    container.innerHTML = '';

    for(let i = 0; i < count; i++) {
      currentQuestionOptions.push({ text: '', index: i });
      const row = document.createElement('div');
      row.className = 'option-input-row';
      row.innerHTML = `
        <input type="text" class="option-input" placeholder="Option ${i + 1}" data-index="${i}" />
        ${count > 2 ? `<button class="btn btn-danger" onclick="removeOption(${i})">✕</button>` : ''}
      `;
      container.appendChild(row);

      const input = row.querySelector('.option-input');
      input.addEventListener('change', (e) => {
        currentQuestionOptions[i].text = e.target.value;
        updateAnswerSelection();
      });
    }

    updateAnswerSelection();
  }

  function updateAnswerSelection() {
    const container = $('answerSelection');
    container.innerHTML = '';

    currentQuestionOptions.forEach((opt, idx) => {
      if(opt.text.trim()) {
        const div = document.createElement('div');
        div.className = 'radio-item';
        div.innerHTML = `
          <input type="radio" name="correctAnswer" value="${idx}" id="answer_${idx}" />
          <label for="answer_${idx}">${opt.text}</label>
        `;
        container.appendChild(div);
      }
    });
  }

  window.addOption = function() {
    const idx = currentQuestionOptions.length;
    currentQuestionOptions.push({ text: '', index: idx });

    const row = document.createElement('div');
    row.className = 'option-input-row';
    row.innerHTML = `
      <input type="text" class="option-input" placeholder="Option ${idx + 1}" data-index="${idx}" />
      <button class="btn btn-danger" onclick="removeOption(${idx})">✕</button>
    `;
    $('optionsInput').appendChild(row);

    const input = row.querySelector('.option-input');
    input.addEventListener('change', (e) => {
      currentQuestionOptions[idx].text = e.target.value;
      updateAnswerSelection();
    });

    updateAnswerSelection();
  };

  window.removeOption = function(index) {
    if(currentQuestionOptions.length <= 2) {
      showMessage('At least 2 options are required', 'error');
      return;
    }

    const inputs = document.querySelectorAll('.option-input');
    inputs[index].parentElement.remove();
    currentQuestionOptions.splice(index, 1);

    // Rebuild indices
    currentQuestionOptions = currentQuestionOptions.map((opt, i) => ({
      text: opt.text,
      index: i
    }));

    // Re-render options
    const container = $('optionsInput');
    container.innerHTML = '';

    const allInputs = document.querySelectorAll('.option-input');
    let optionTexts = [];
    allInputs.forEach((inp, i) => {
      optionTexts.push(inp.value);
    });

    optionTexts.forEach((text, i) => {
      const row = document.createElement('div');
      row.className = 'option-input-row';
      row.innerHTML = `
        <input type="text" class="option-input" placeholder="Option ${i + 1}" value="${text}" data-index="${i}" />
        ${optionTexts.length > 2 ? `<button class="btn btn-danger" onclick="removeOption(${i})">✕</button>` : ''}
      `;
      container.appendChild(row);

      const input = row.querySelector('.option-input');
      input.addEventListener('change', (e) => {
        currentQuestionOptions[i].text = e.target.value;
        updateAnswerSelection();
      });
    });

    updateAnswerSelection();
  };

  window.addQuestion = function() {
    const questionText = $('questionText').value.trim();
    const answerRadios = document.querySelectorAll('input[name="correctAnswer"]');
    const selectedAnswer = Array.from(answerRadios).find(r => r.checked);

    // Validation
    if(!questionText) {
      showMessage('Please enter a question', 'error');
      return;
    }

    const filledOptions = currentQuestionOptions.filter(o => o.text.trim());
    if(filledOptions.length < 2) {
      showMessage('Please add at least 2 options', 'error');
      return;
    }

    if(!selectedAnswer) {
      showMessage('Please select the correct answer', 'error');
      return;
    }

    // Create question object in exam format
    const correctAnswerText = filledOptions[parseInt(selectedAnswer.value)].text;
    const questionObj = {
      q: questionText,
      o: filledOptions.map(o => o.text),
      a: correctAnswerText
    };

    addedQuestions.push(questionObj);
    displayQuestions();
    clearForm();
    showMessage(`Question added! Total: ${addedQuestions.length}`, 'success');
  };

  window.deleteQuestion = function(index) {
    addedQuestions.splice(index, 1);
    displayQuestions();
    showMessage('Question removed', 'success');
  };

  function displayQuestions() {
    const container = $('questionsList');
    $('questionCount').textContent = addedQuestions.length;

    container.innerHTML = '';

    if(addedQuestions.length === 0) {
      container.innerHTML = '<p class="muted" style="text-align: center; padding: 20px;">No questions added yet</p>';
      return;
    }

    addedQuestions.forEach((q, idx) => {
      const div = document.createElement('div');
      div.className = 'question-item';
      div.innerHTML = `
        <h5>Q${idx + 1}: ${q.q}</h5>
        <p><strong>Options:</strong> ${q.o.join(' • ')}</p>
        <p><strong>Answer:</strong> <span style="color: #4CAF50; font-weight: bold;">${q.a}</span></p>
        <button class="btn btn-danger" onclick="deleteQuestion(${idx})">Remove</button>
      `;
      container.appendChild(div);
    });
  }

  window.clearForm = function() {
    $('questionText').value = '';
    initializeOptions(4);
    document.querySelectorAll('input[name="correctAnswer"]').forEach(r => r.checked = false);
    $('questionText').focus();
  };

  window.saveQuiz = function() {
    const quizName = $('quizName').value.trim();
    const duration = parseInt($('quizDuration').value) || 10;

    if(!quizName) {
      showMessage('Please enter a quiz name', 'error');
      return;
    }

    if(addedQuestions.length === 0) {
      showMessage('Please add at least one question', 'error');
      return;
    }

    try {
      const customQuizzes = JSON.parse(localStorage.getItem('customQuizzes') || '{}');

      if(customQuizzes[quizName]) {
        if(!confirm(`Quiz "${quizName}" already exists. Overwrite?`)) {
          return;
        }
      }

      customQuizzes[quizName] = {
        name: quizName,
        durationSeconds: duration * 60,
        questions: addedQuestions,
        createdAt: new Date().toISOString(),
        isCustom: true
      };

      localStorage.setItem('customQuizzes', JSON.stringify(customQuizzes));
      showMessage(`✓ Quiz "${quizName}" saved successfully!`, 'success');

      // Reset form
      addedQuestions = [];
      $('quizName').value = '';
      $('quizDuration').value = '10';
      clearForm();
      displayQuestions();
      loadSavedQuizzes();

    } catch(e) {
      showMessage('Error saving quiz: ' + e.message, 'error');
    }
  };

  window.exportQuiz = function() {
    if(addedQuestions.length === 0) {
      showMessage('Please add at least one question before exporting', 'error');
      return;
    }

    const quizName = $('quizName').value.trim() || 'quiz';
    const quizData = {
      name: quizName,
      durationSeconds: (parseInt($('quizDuration').value) || 10) * 60,
      questions: addedQuestions
    };

    const json = JSON.stringify(quizData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${quizName}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showMessage('Quiz exported as JSON', 'success');
  };

  function loadSavedQuizzes() {
    try {
      const customQuizzes = JSON.parse(localStorage.getItem('customQuizzes') || '{}');
      const container = $('savedQuizzesList');

      const quizList = Object.values(customQuizzes);

      if(quizList.length === 0) {
        container.innerHTML = '<p class="muted" style="grid-column: 1/-1; text-align: center;">No saved quizzes yet</p>';
        return;
      }

      container.innerHTML = '';
      quizList.forEach(quiz => {
        const card = document.createElement('div');
        card.className = 'quiz-card';
        const createdDate = new Date(quiz.createdAt).toLocaleDateString();
        const duration = Math.round(quiz.durationSeconds / 60);

        card.innerHTML = `
          <h4>${quiz.name}</h4>
          <p>📚 Questions: <strong>${quiz.questions.length}</strong></p>
          <p>⏱️ Duration: <strong>${duration} min</strong></p>
          <p class="muted">Created: ${createdDate}</p>
          <div class="quiz-card-actions">
            <button class="btn btn-primary" onclick="playCustomQuiz('${quiz.name}')">Play</button>
            <button class="btn btn-secondary" onclick="editQuiz('${quiz.name}')" title="Edit quiz">Edit</button>
            <button class="btn btn-danger" onclick="deleteQuiz('${quiz.name}')">Delete</button>
          </div>
        `;
        container.appendChild(card);
      });

    } catch(e) {
      console.error('Error loading saved quizzes:', e);
    }
  }

  window.playCustomQuiz = function(quizName) {
    try {
      const customQuizzes = JSON.parse(localStorage.getItem('customQuizzes') || '{}');
      if(customQuizzes[quizName]) {
        localStorage.setItem('selectedTest', quizName);
        window.location.href = './exam.html';
      } else {
        showMessage('Quiz not found', 'error');
      }
    } catch(e) {
      showMessage('Error loading quiz: ' + e.message, 'error');
    }
  };

  window.deleteQuiz = function(quizName) {
    if(!confirm(`Delete quiz "${quizName}"? This cannot be undone.`)) {
      return;
    }

    try {
      const customQuizzes = JSON.parse(localStorage.getItem('customQuizzes') || '{}');
      delete customQuizzes[quizName];
      localStorage.setItem('customQuizzes', JSON.stringify(customQuizzes));

      showMessage(`Quiz "${quizName}" deleted`, 'success');
      loadSavedQuizzes();
    } catch(e) {
      showMessage('Error deleting quiz: ' + e.message, 'error');
    }
  };

  window.editQuiz = function(quizName) {
    try {
      const customQuizzes = JSON.parse(localStorage.getItem('customQuizzes') || '{}');
      const quiz = customQuizzes[quizName];
      if(!quiz) {
        showMessage('Quiz not found', 'error');
        return;
      }

      // Load quiz data into form
      addedQuestions = [...quiz.questions];
      $('quizName').value = quiz.name;
      $('quizDuration').value = Math.round(quiz.durationSeconds / 60);

      displayQuestions();
      showMessage(`Editing quiz "${quizName}"`, 'success');

      // Scroll to form
      document.querySelector('.quiz-form').scrollIntoView({ behavior: 'smooth' });

      // Optional: auto-delete after editing
    } catch(e) {
      showMessage('Error loading quiz for editing: ' + e.message, 'error');
    }
  };

  window.goBack = function() {
    window.location.href = './dashboard.html';
  };

  function showMessage(msg, type) {
    const container = $('saveMessage');
    container.textContent = msg;
    container.className = `message ${type}`;
    container.style.display = 'block';

    setTimeout(() => {
      container.style.display = 'none';
    }, 4000);
  }
})();
