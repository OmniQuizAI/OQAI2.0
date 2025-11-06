
import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI, Type, Modality } from "@google/genai";

// Fix: Declare global libraries to resolve 'Cannot find name' errors
declare const pdfjsLib: any;
declare const mammoth: any;
declare const marked: any;
declare const jspdf: any;

// Fix: Resolved "Subsequent property declarations" error by using a named interface 'AIStudio'
// for window.aistudio, ensuring type consistency across declarations.
// Fix: Moved AIStudio interface into declare global to resolve subsequent property declaration error.
declare global {
    interface AIStudio {
        hasSelectedApiKey: () => Promise<boolean>;
        openSelectKey: () => Promise<void>;
    }

    interface Window {
        aistudio?: AIStudio;
        webkitAudioContext: typeof AudioContext
    }
}


const translations = {
    en: {
        // Step 1
        step1Title: 'Step 1: Provide Content',
        pasteTabText: 'Paste Text',
        uploadTabText: 'Upload File',
        topicTabText: 'Generate from Topic',
        loadCodeTabText: 'Load from Code',
        pastePlaceholder: 'Paste your text here to generate a quiz from it...',
        codePlaceholder: 'Paste your quiz code here...',
        loadQuizButton: 'Load Quiz',
        invalidQuizCode: 'Invalid Quiz Code. Please check the code and try again.',
        nextButton: 'Next',
        dropZoneText: 'Drag & drop files (PDF, DOCX, JPG, PNG) or click to select',
        topicPlaceholder: 'e.g., The Roman Empire',
        topicLengthLabel: 'Length',
        short: 'Short',
        medium: 'Medium',
        long: 'Long',
        generateUseTextButton: 'Generate & Use Text',
        // API Key Prompt
        apiKeyRequiredTitle: 'API Key Required for Image Analysis',
        apiKeyRequiredInfo: 'To analyze images, you need to select an API key. This action may require a project with billing enabled.',
        apiKeyLearnMore: 'Learn more about billing.',
        apiKeyError: "Your API key doesn't have the right permissions. Please select a project with billing enabled and try again.",
        selectApiKey: 'Select API Key',
        cancel: 'Cancel',
        // Step 2
        step2Title: 'Step 2: Customize Your Quiz',
        difficultyLabel: 'Difficulty',
        easy: 'Easy',
        hard: 'Hard',
        aiChooseAmountLabel: 'Let AI choose best question amount',
        numQuestionsLabel: 'Number of Questions',
        questionTypesLabel: 'Question Types (select at least one)',
        multipleChoice: 'Multiple Choice',
        trueFalse: 'True / False',
        matching: 'Matching',
        shortAnswer: 'Short Answer',
        longAnswer: 'Long Answer',
        fillInTheBlank: 'Fill in the Blank',
        correctionStyleLabel: 'Correction Style',
        immediate: 'Immediate',
        afterQuiz: 'After Quiz',
        both: 'Both',
        spacedRepetitionLabel: 'Spaced Repetition Mode',
        generateQuizButton: 'Generate Quiz',
        // Quiz Step
        reviewingQuestion: 'Reviewing',
        of: 'of',
        question: 'Question',
        maxAttemptsReached: "You've reached the maximum attempts for this question.",
        loadingMatchingGame: 'Loading matching game...',
        typeYourAnswer: 'Type your answer here...',
        submitAnswer: 'Submit Answer',
        grading: 'Grading...',
        continueToReview: 'Continue to Review',
        finishQuiz: 'Finish Quiz',
        // Results Step
        quizComplete: 'Quiz Complete!',
        score: 'Score',
        correct: 'Correct',
        reviewAnswers: 'Review Your Answers',
        yourAnswer: 'Your Answer',
        yourScore: 'Your Score',
        points: 'Points',
        correctPairings: 'Correct Pairings',
        correctAnswer: 'Correct Answer',
        aiFeedback: 'AI Feedback',
        explanation: 'Explanation',
        tryAgain: 'Try Again',
        createNewQuiz: 'Create New Quiz',
        // Loading Screen
        generatingQuizLoader: 'Generating your quiz...',
        analyzingPdfLoader: 'Analyzing PDF...',
        analyzingDocxLoader: 'Analyzing DOCX...',
        analyzingImageLoader: 'Analyzing Image (OCR)...',
        researchingTopicLoader: 'Researching',
        loadingFromCode: 'Loading your quiz...',
        pdfOcrFallback: 'No text found, trying OCR...',
        processingFile: 'Processing file',
        noTextExtracted: 'Could not extract any text from the selected file(s).',
        adaptingForAudio: 'Adapting questions for audio...',
        // Export
        export: 'Export',
        saveAsPdf: 'Save as PDF',
        generateAudio: 'Generate Audio File (.wav)',
        saveToCode: 'Save Quiz to Code',
        exportToFlashcards: 'Study with Flashcards',
        exportToConversational: 'Start Conversational Quiz',
        yourQuizCode: 'Your Quiz Code',
        copy: 'Copy',
        copied: 'Copied!',
        close: 'Close',
        generatingPdf: 'Generating PDF...',
        generatingAudioFor: 'Generating audio for question',
        combiningAudio: 'Combining audio files...',
        pdfExportSettings: 'PDF Export Settings',
        audioExportSettings: 'Audio Export Settings',
        pdfModalInfo: 'Your quiz will be saved as a PDF file using the Oxygen font for best compatibility.',
        pauseDuration: 'Pause between items',
        seconds: 'seconds',
        // Flashcards
        preparingFlashcards: 'Preparing your flashcards...',
        gotItRight: 'Got it right',
        gotItWrong: 'Got it wrong',
        dragCardHere: 'Drag card here',
        flashcardsComplete: 'All Cards Mastered!',
        studyAgain: 'Study Again',
        exitFlashcards: 'Exit Flashcards',
        card: 'Card',
        flashcardHint: 'Click card to flip, then choose if you got it right or wrong.',
        goToHomepage: 'Go to Homepage',
        // Conversation Mode
        exitConversation: 'Exit Conversation',
        conversationStatusInitializing: 'Initializing audio...',
        conversationStatusAsking: 'OmniQuiz is asking a question...',
        conversationStatusListening: "Listening... Speak your answer and say 'done' when finished.",
        conversationStatusEvaluating: "Checking your answer...",
        conversationStatusResponding: 'OmniQuiz is responding...',
        conversationStatusComplete: 'Conversational quiz complete!',
        permissionDeniedTitle: 'Microphone Access Denied',
        permissionDeniedInfo1: 'OmniQuiz needs access to your microphone for the conversational quiz.',
        permissionDeniedInfo2: "To enable it, please go to your browser's site settings and allow microphone access.",
        permissionRefreshButton: "I've enabled it, refresh",
        checkingPermissions: 'Checking microphone permissions...',
    },
    es: {
        // Step 1
        step1Title: 'Paso 1: Proporcionar Contenido',
        pasteTabText: 'Pegar Texto',
        uploadTabText: 'Subir Archivo',
        topicTabText: 'Generar desde Tema',
        loadCodeTabText: 'Cargar desde Código',
        pastePlaceholder: 'Pega tu texto aquí para generar un cuestionario...',
        codePlaceholder: 'Pega tu código de cuestionario aquí...',
        loadQuizButton: 'Cargar Cuestionario',
        invalidQuizCode: 'Código de cuestionario inválido. Por favor, revisa el código e intenta de nuevo.',
        nextButton: 'Siguiente',
        dropZoneText: 'Arrastra y suelta archivos (PDF, DOCX, JPG, PNG) o haz clic para seleccionar',
        topicPlaceholder: 'ej., El Imperio Romano',
        topicLengthLabel: 'Longitud',
        short: 'Corto',
        medium: 'Medio',
        long: 'Largo',
        generateUseTextButton: 'Generar y Usar Texto',
        // API Key Prompt
        apiKeyRequiredTitle: 'Se Requiere Clave de API para Análisis de Imágenes',
        apiKeyRequiredInfo: 'Para analizar imágenes, necesitas seleccionar una clave de API. Esta acción puede requerir un proyecto con la facturación habilitada.',
        apiKeyLearnMore: 'Aprende más sobre la facturación.',
        apiKeyError: "Tu clave de API no tiene los permisos correctos. Por favor, selecciona un proyecto con facturación habilitada e inténtalo de nuevo.",
        selectApiKey: 'Seleccionar Clave de API',
        cancel: 'Cancelar',
        // Step 2
        step2Title: 'Paso 2: Personaliza tu Cuestionario',
        difficultyLabel: 'Dificultad',
        easy: 'Fácil',
        hard: 'Difícil',
        aiChooseAmountLabel: 'Dejar que la IA elija la cantidad de preguntas',
        numQuestionsLabel: 'Número de Preguntas',
        questionTypesLabel: 'Tipos de Pregunta (selecciona al menos uno)',
        multipleChoice: 'Opción Múltiple',
        trueFalse: 'Verdadero / Falso',
        matching: 'Relacionar',
        shortAnswer: 'Respuesta Corta',
        longAnswer: 'Respuesta Larga',
        fillInTheBlank: 'Rellenar el Espacio',
        correctionStyleLabel: 'Estilo de Corrección',
        immediate: 'Inmediata',
        afterQuiz: 'Después del Cuestionario',
        both: 'Ambos',
        spacedRepetitionLabel: 'Modo de Repetición Espaciada',
        generateQuizButton: 'Generar Cuestionario',
        // Quiz Step
        reviewingQuestion: 'Revisando',
        of: 'de',
        question: 'Pregunta',
        maxAttemptsReached: "Has alcanzado el máximo de intentos para esta pregunta.",
        loadingMatchingGame: 'Cargando juego de relacionar...',
        typeYourAnswer: 'Escribe tu respuesta aquí...',
        submitAnswer: 'Enviar Respuesta',
        grading: 'Calificando...',
        continueToReview: 'Continuar a la Revisión',
        finishQuiz: 'Finalizar Cuestionario',
        // Results Step
        quizComplete: '¡Cuestionario Completo!',
        score: 'Puntuación',
        correct: 'Correctas',
        reviewAnswers: 'Revisa tus Respuestas',
        yourAnswer: 'Tu Respuesta',
        yourScore: 'Tu Puntuación',
        points: 'Puntos',
        correctPairings: 'Pares Correctos',
        correctAnswer: 'Respuesta Correcta',
        aiFeedback: 'Feedback de la IA',
        explanation: 'Explicación',
        tryAgain: 'Intentar de Nuevo',
        createNewQuiz: 'Crear Nuevo Cuestionario',
        // Loading Screen
        generatingQuizLoader: 'Generando tu cuestionario...',
        analyzingPdfLoader: 'Analizando PDF...',
        analyzingDocxLoader: 'Analizando DOCX...',
        analyzingImageLoader: 'Analizando Imagen (OCR)...',
        researchingTopicLoader: 'Investigando',
        loadingFromCode: 'Cargando tu cuestionario...',
        pdfOcrFallback: 'No se encontró texto, intentando OCR...',
        processingFile: 'Procesando archivo',
        noTextExtracted: 'No se pudo extraer texto de los archivos seleccionados.',
        adaptingForAudio: 'Adaptando preguntas para audio...',
        // Export
        export: 'Exportar',
        saveAsPdf: 'Guardar como PDF',
        generateAudio: 'Generar Archivo de Audio (.wav)',
        saveToCode: 'Guardar Cuestionario en Código',
        exportToFlashcards: 'Estudiar con Tarjetas',
        exportToConversational: 'Iniciar Cuestionario Conversacional',
        yourQuizCode: 'Tu Código de Cuestionario',
        copy: 'Copiar',
        copied: '¡Copiado!',
        close: 'Cerrar',
        generatingPdf: 'Generando PDF...',
        generatingAudioFor: 'Generando audio para la pregunta',
        combiningAudio: 'Combinando archivos de audio...',
        pdfExportSettings: 'Ajustes de Exportación PDF',
        audioExportSettings: 'Ajustes de Exportación de Audio',
        pdfModalInfo: 'Tu cuestionario se guardará como un archivo PDF utilizando la fuente Oxygen para una mejor compatibilidad.',
        pauseDuration: 'Pausa entre elementos',
        seconds: 'segundos',
        // Flashcards
        preparingFlashcards: 'Preparando tus tarjetas...',
        gotItRight: '¡Correcto!',
        gotItWrong: 'Incorrecto',
        dragCardHere: 'Arrastra la tarjeta aquí',
        flashcardsComplete: '¡Todas las Tarjetas Dominadas!',
        studyAgain: 'Estudiar de Nuevo',
        exitFlashcards: 'Salir de Tarjetas',
        card: 'Tarjeta',
        flashcardHint: 'Haz clic en la tarjeta para voltearla, luego elige si la tuviste correcta o incorrecta.',
        goToHomepage: 'Ir a la Página Principal',
        // Conversation Mode
        exitConversation: 'Salir de Conversación',
        conversationStatusInitializing: 'Iniciando audio...',
        conversationStatusAsking: 'OmniQuiz está haciendo una pregunta...',
        conversationStatusListening: "Escuchando... Di tu respuesta y luego 'listo' al terminar.",
        conversationStatusEvaluating: "Comprobando tu respuesta...",
        conversationStatusResponding: 'OmniQuiz está respondiendo...',
        conversationStatusComplete: '¡Cuestionario conversacional completo!',
        permissionDeniedTitle: 'Acceso al Micrófono Denegado',
        permissionDeniedInfo1: 'OmniQuiz necesita acceso a tu micrófono para el cuestionario conversacional.',
        permissionDeniedInfo2: 'Para habilitarlo, ve a la configuración del sitio en tu navegador y permite el acceso al micrófono.',
        permissionRefreshButton: 'Lo he habilitado, actualizar',
        checkingPermissions: 'Comprobando permisos...',
    },
    fr: {
        // Step 1
        step1Title: 'Étape 1: Fournir le Contenu',
        pasteTabText: 'Coller le Texte',
        uploadTabText: 'Télécharger un Fichier',
        topicTabText: 'Générer à partir d\'un Sujet',
        loadCodeTabText: 'Charger depuis Code',
        pastePlaceholder: 'Collez votre texte ici pour générer un quiz...',
        codePlaceholder: 'Collez votre code de quiz ici...',
        loadQuizButton: 'Charger le Quiz',
        invalidQuizCode: 'Code de quiz invalide. Veuillez vérifier le code et réessayer.',
        nextButton: 'Suivant',
        dropZoneText: 'Glissez-déposez des fichiers (PDF, DOCX, JPG, PNG) ou cliquez pour sélectionner',
        topicPlaceholder: 'ex., L\'Empire Romain',
        topicLengthLabel: 'Longueur',
        short: 'Court',
        medium: 'Moyen',
        long: 'Long',
        generateUseTextButton: 'Générer et Utiliser le Texte',
        // API Key Prompt
        apiKeyRequiredTitle: "Clé API Requise pour l'Analyse d'Image",
        apiKeyRequiredInfo: "Pour analyser des images, vous devez sélectionner une clé API. Cette action peut nécessiter un projet avec la facturation activée.",
        apiKeyLearnMore: 'En savoir plus sur la facturation.',
        apiKeyError: "Votre clé API n'a pas les bonnes autorisations. Veuillez sélectionner un projet avec la facturation activée et réessayer.",
        selectApiKey: "Sélectionner la Clé d'API",
        cancel: 'Annuler',
        // Step 2
        step2Title: 'Étape 2: Personnalisez votre Quiz',
        difficultyLabel: 'Difficulté',
        easy: 'Facile',
        hard: 'Difficile',
        aiChooseAmountLabel: "Laisser l'IA choisir le nombre de questions",
        numQuestionsLabel: 'Nombre de Questions',
        questionTypesLabel: 'Types de Questions (sélectionnez-en au moins un)',
        multipleChoice: 'Choix Multiple',
        trueFalse: 'Vrai / Faux',
        matching: 'Association',
        shortAnswer: 'Réponse Courte',
        longAnswer: 'Réponse Longue',
        fillInTheBlank: 'Texte à Trous',
        correctionStyleLabel: 'Style de Correction',
        immediate: 'Immédiate',
        aprèsLeQuiz: 'Après le Quiz',
        both: 'Les Deux',
        spacedRepetitionLabel: 'Mode de Répétition Espacée',
        generateQuizButton: 'Générer le Quiz',
        // Quiz Step
        reviewingQuestion: 'En révision',
        of: 'de',
        question: 'Question',
        maxAttemptsReached: "Vous avez atteint le nombre maximum de tentatives pour cette question.",
        loadingMatchingGame: "Chargement du jeu d'association...",
        typeYourAnswer: 'Tapez votre réponse ici...',
        submitAnswer: 'Soumettre la Réponse',
        grading: 'Évaluation...',
        continueToReview: 'Continuer vers la Révision',
        finishQuiz: 'Terminer le Quiz',
        // Results Step
        quizComplete: 'Quiz Terminé !',
        score: 'Score',
        correct: 'Correctes',
        reviewAnswers: 'Révisez vos Réponses',
        yourAnswer: 'Votre Réponse',
        yourScore: 'Votre Score',
        points: 'Points',
        correctPairings: 'Associations Correctes',
        correctAnswer: 'Réponse Correcte',
        aiFeedback: 'Feedback de l\'IA',
        explanation: 'Explication',
        tryAgain: 'Réessayer',
        createNewQuiz: 'Créer un Nouveau Quiz',
        // Loading Screen
        generatingQuizLoader: 'Génération de votre quiz...',
        analyzingPdfLoader: 'Analyse du PDF...',
        analyzingDocxLoader: 'Analyse du DOCX...',
        analyzingImageLoader: "Analyse de l'Image (OCR)...",
        researchingTopicLoader: 'Recherche sur',
        loadingFromCode: 'Chargement de votre quiz...',
        pdfOcrFallback: 'Aucun texte trouvé, essai de l\'OCR...',
        processingFile: 'Traitement du fichier',
        noTextExtracted: 'Impossible d\'extraire du texte des fichiers sélectionnés.',
        adaptingForAudio: 'Adaptation des questions pour l\'audio...',
        // Export
        export: 'Exporter',
        saveAsPdf: 'Enregistrer en PDF',
        generateAudio: 'Générer un Fichier Audio (.wav)',
        saveToCode: 'Enregistrer le Quiz en Code',
        exportToFlashcards: 'Étudier avec des Cartes',
        exportToConversational: 'Démarrer le Quiz Conversationnel',
        yourQuizCode: 'Votre Code de Quiz',
        copy: 'Copier',
        copied: 'Copié !',
        close: 'Fermer',
        generatingPdf: 'Génération du PDF...',
        generatingAudioFor: "Génération de l'audio pour la question",
        combiningAudio: "Combinaison des fichiers audio...",
        pdfExportSettings: 'Paramètres d\'Exportation PDF',
        audioExportSettings: 'Paramètres d\'Exportation Audio',
        pdfModalInfo: 'Votre quiz sera enregistré en tant que fichier PDF en utilisant la police Oxygen pour une meilleure compatibilité.',
        pauseDuration: 'Pause entre les éléments',
        seconds: 'secondes',
        // Flashcards
        preparingFlashcards: 'Préparation de vos cartes...',
        gotItRight: 'Correct',
        gotItWrong: 'Incorrect',
        dragCardHere: 'Faites glisser la carte ici',
        flashcardsComplete: 'Toutes les Cartes Maîtrisées !',
        studyAgain: 'Réviser à Nouveau',
        exitFlashcards: 'Quitter les Cartes',
        card: 'Carte',
        flashcardHint: 'Cliquez sur la carte pour la retourner, puis choisissez si vous avez eu raison ou tort.',
        goToHomepage: 'Aller à la Page d\'Accueil',
        // Conversation Mode
        exitConversation: 'Quitter la Conversation',
        conversationStatusInitializing: 'Initialisation de l\'audio...',
        conversationStatusAsking: 'OmniQuiz pose une question...',
        conversationStatusListening: "J'écoute... Donnez votre réponse et dites 'terminé' lorsque vous avez fini.",
        conversationStatusEvaluating: 'Vérification de votre réponse...',
        conversationStatusResponding: 'OmniQuiz répond...',
        conversationStatusComplete: 'Quiz conversationnel terminé !',
        permissionDeniedTitle: 'Accès au Microphone Refusé',
        permissionDeniedInfo1: "OmniQuiz a besoin d'accéder à votre microphone pour le quiz conversationnel.",
        permissionDeniedInfo2: "Pour l'activer, rendez-vous dans les paramètres du site de votre navigateur et autorisez l'accès au microphone.",
        permissionRefreshButton: "Je l'ai activé, rafraîchir",
        checkingPermissions: 'Vérification des permissions...',
    }
};

const AppLogo = () => (
    <svg viewBox="0 0 100 100" className="loading-icon-svg" aria-label="OmniQuiz Logo">
        <defs>
            <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--green)" />
                <stop offset="100%" stopColor="var(--blue)" />
            </linearGradient>
        </defs>
        {/* The 'O' shape */}
        <circle cx="50" cy="50" r="45" fill="none" stroke="url(#logo-gradient)" strokeWidth="10" />
        {/* The 'Q' text in the middle */}
        <text
            x="50"
            y="50"
            dominantBaseline="central"
            textAnchor="middle"
            fontFamily="Nunito, sans-serif"
            fontSize="65"
            fontWeight="800"
            fill="currentColor"
        >
            Q
        </text>
    </svg>
);

const ThemeToggleButton = ({ theme, toggleTheme }) => (
    <button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
        <svg className="icon sun" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <svg className="icon moon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
    </button>
);


const App = () => {
    const [step, setStep] = React.useState('input'); // 'input', 'options', 'quiz', 'results', 'flashcards', 'conversation'
    const [previousStep, setPreviousStep] = React.useState('input');
    const [contextText, setContextText] = React.useState('');
    const [quizOptions, setQuizOptions] = React.useState({
        numQuestions: 10,
        questionTypes: ['multiple-choice'],
        correctionStyle: 'after',
        spacedRepetition: false,
        aiChoosesAmount: false,
        difficulty: 'medium',
    });
    const [quizData, setQuizData] = React.useState(null);
    const [userAnswers, setUserAnswers] = React.useState([]);
    const [loadingState, setLoadingState] = React.useState({
        isLoading: false,
        text: '',
        context: null,
    });
    const [language, setLanguage] = React.useState('en');
    const [theme, setTheme] = React.useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? 'dark' : 'light';
    });

    const t = React.useCallback((key) => translations[language][key] || key, [language]);

    React.useEffect(() => {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const showLoader = React.useCallback((text, context = null) => setLoadingState({ isLoading: true, text, context }), []);
    const hideLoader = React.useCallback(() => setLoadingState({ isLoading: false, text: '', context: null }), []);

    const handleEnterFlashcards = () => {
        setPreviousStep(step);
        setStep('flashcards');
    };
    
    const handleEnterConversationMode = () => {
        setPreviousStep(step);
        setStep('conversation');
    };

    const handleExitSecondaryModes = () => {
        setStep(previousStep);
    };

    const handleContextReady = (text) => {
        setContextText(text);
        setStep('options');
    };

    // Fix: Add string type to `encodedString` to resolve property access error.
    const handleLoadFromCode = (encodedString: string) => {
        showLoader(t('loadingFromCode'));

        setTimeout(() => {
            try {
                const binaryString = atob(encodedString.trim());
                const jsonString = decodeURIComponent(
                    Array.prototype.map.call(binaryString, c => {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join('')
                );
                const data = JSON.parse(jsonString);

                if (data.quizData && Array.isArray(data.quizData) && data.options) {
                    setQuizData(data.quizData);
                    setQuizOptions(prevOptions => ({ ...prevOptions, ...data.options }));
                    setUserAnswers(new Array(data.quizData.length).fill(null).map(() => ({ attempts: [] })));
                    setContextText(data.contextText || '');
                    setStep('quiz');
                } else {
                    throw new Error("Invalid data structure");
                }
            } catch (error) {
                console.error("Failed to load quiz from code:", error);
                alert(t('invalidQuizCode'));
            } finally {
                hideLoader();
            }
        }, 50);
    };


    const handleOptionsConfirm = async (options) => {
        setQuizOptions(options);
        showLoader(t('generatingQuizLoader'), contextText);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const schema = {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        question: { type: Type.STRING, description: "The question text. For fill-in-the-blank, use '_____' for the blank. For matching, use an instruction like 'Match the terms to their definitions.'" },
                        type: { type: Type.STRING, enum: options.questionTypes },
                        options: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true, description: "A list of 4 options for multiple-choice questions. Null for other types." },
                        answer: { type: Type.STRING, nullable: true, description: "The correct answer. For fill-in-the-blank, this is the word for the blank. For short/long answer, this is a model correct answer. Not used for 'matching'." },
                        explanation: { type: Type.STRING, description: "A brief explanation of why the answer is correct." },
                        matchPairs: {
                            type: Type.ARRAY,
                            nullable: true,
                            description: "ONLY for 'matching' questions. An array of 3 to 5 objects, each with a 'term' and a 'definition'.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    term: { type: Type.STRING },
                                    definition: { type: Type.STRING }
                                },
                                required: ['term', 'definition']
                            }
                        }
                    },
                    required: ['question', 'type', 'explanation']
                }
            };
            
            const languageMap = { en: 'English', es: 'Spanish', fr: 'French' };
            const targetLanguage = languageMap[language];

            const numQuestionsPrompt = options.aiChoosesAmount
                ? "Based on the length and complexity of the text, generate an appropriate number of questions for a comprehensive quiz. The number should be between 5 and 100."
                : `Generate a quiz with approximately ${options.numQuestions} questions.`;
            
            const difficultyMap = {
                easy: 'simple and straightforward, suitable for beginners.',
                medium: 'of moderate difficulty, testing good comprehension.',
                hard: 'challenging, requiring in-depth understanding and critical thinking.'
            };
            const difficultyDescription = difficultyMap[options.difficulty] || difficultyMap['medium'];

            const prompt = `Based on the following text, ${numQuestionsPrompt}
            The quiz questions should be ${difficultyDescription}.
            The entire quiz, including all questions, options (for multiple-choice), answers, and explanations, MUST be in ${targetLanguage}.
            The question types should be from this list: [${options.questionTypes.join(', ')}].
            - For 'multiple-choice', provide exactly 4 options.
            - For 'true-false', the answer must be 'True' or 'False'. 
            - For 'fill-in-the-blank', provide a sentence with '_____' as the blank, and the answer should be the word that fills it.
            - For 'matching', the 'question' should be an instruction like "Match the following terms to their definitions". Do not provide an 'answer'. Instead, populate the 'matchPairs' field with an array of 3 to 5 objects, where each object has a 'term' and a 'definition'. Keep terms and definitions relatively short.
            - For 'short-answer' and 'long-answer', the question is a prompt and the answer is a detailed model answer derived from the text.
            Provide a brief explanation for each correct answer.

            Context Text:
            ---
            ${contextText}
            ---
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: schema,
                }
            });
            
            let generatedQuiz = JSON.parse(response.text);
             // Ensure matchPairs is always an array for matching questions
            generatedQuiz = generatedQuiz.map(q => {
                if (q.type === 'matching' && !q.matchPairs) {
                    q.matchPairs = [];
                }
                return q;
            });
            setQuizData(generatedQuiz);
            setUserAnswers(new Array(generatedQuiz.length).fill(null).map(() => ({ attempts: [] })));
            setStep('quiz');
        } catch (error) {
            console.error("Error generating quiz:", error);
            alert(`Quiz generation failed. Details: ${error.message}`);
        } finally {
            hideLoader();
        }
    };

    const handleQuizComplete = (finalAnswers) => {
        setUserAnswers(finalAnswers);
        setStep('results');
    };

    const restartQuiz = () => {
        setStep('input');
        setContextText('');
        setQuizData(null);
        setUserAnswers([]);
    };
    
    const tryAgain = () => {
        setUserAnswers(new Array(quizData.length).fill(null).map(() => ({ attempts: [] })));
        setStep('quiz');
    };

    const renderStep = () => {
        const isSecondaryMode = step === 'flashcards' || step === 'conversation';
        switch (step) {
            case 'input':
                return <InputStep onContextReady={handleContextReady} onLoadFromCode={handleLoadFromCode} showLoader={showLoader} hideLoader={hideLoader} t={t} />;
            case 'options':
                return <OptionsStep onConfirm={handleOptionsConfirm} t={t} />;
            case 'quiz':
                return <QuizStep quizData={quizData} onComplete={handleQuizComplete} options={quizOptions} contextText={contextText} t={t} />;
            case 'results':
                return <ResultsStep results={userAnswers} quizData={quizData} onRestart={restartQuiz} onTryAgain={tryAgain} t={t} />;
             case 'flashcards':
                return <FlashcardStep quizData={quizData} onExit={handleExitSecondaryModes} showLoader={showLoader} hideLoader={hideLoader} t={t} language={language} />;
            case 'conversation':
                return <ConversationStep quizData={quizData} onExit={handleExitSecondaryModes} t={t} language={language} contextText={contextText} showLoader={showLoader} hideLoader={hideLoader} />;
            default:
                return <InputStep onContextReady={handleContextReady} onLoadFromCode={handleLoadFromCode} showLoader={showLoader} hideLoader={hideLoader} t={t} />;
        }
    };

    const isSecondaryMode = step === 'flashcards' || step === 'conversation';

    return (
        <>
            {loadingState.isLoading && <LoadingScreen text={loadingState.text} context={loadingState.context} language={language} t={t} />}
            <div className="container" style={{paddingTop: isSecondaryMode ? '3rem' : '4rem', maxWidth: isSecondaryMode ? '800px' : '800px'}}>
                <header className="app-header-controls">
                    {step !== 'input' && (
                        <button className="home-btn" onClick={restartQuiz} aria-label={t('goToHomepage')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                        </button>
                    )}
                    {(step === 'quiz' || step === 'results') && (
                        <ExportDropdown
                            quizData={quizData}
                            onEnterFlashcards={handleEnterFlashcards}
                            onEnterConversationMode={handleEnterConversationMode}
                            quizOptions={quizOptions}
                            contextText={contextText}
                            showLoader={showLoader}
                            hideLoader={hideLoader}
                            t={t}
                            language={language}
                        />
                     )}
                     <div className="language-selector">
                        <select value={language} onChange={(e) => setLanguage(e.target.value)} aria-label="Select language">
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                        </select>
                    </div>
                    <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
                </header>
                {!isSecondaryMode && <h1><AppLogo /> OmniQuiz 2.0</h1>}
                {renderStep()}
            </div>
        </>
    );
};

const LoadingScreen = ({ text, context, language, t }) => {
    const [funFact, setFunFact] = React.useState({ fact: '', emoji: '' });

    React.useEffect(() => {
        const getFunFact = async () => {
            if (context) {
                try {
                    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                     const languageMap = { en: 'English', es: 'Spanish', fr: 'French' };
                     const targetLanguage = languageMap[language] || 'English';

                    const factPrompt = `Based on the following text, provide a single, short, interesting "fun fact" and a single relevant emoji. The fact MUST be in ${targetLanguage}. Return ONLY a JSON object with "fact" and "emoji" keys.

                    Text:
                    ---
                    ${context.substring(0, 2000)}
                    ---`;
                    const response = await ai.models.generateContent({
                        model: 'gemini-2.5-flash',
                        contents: factPrompt,
                        config: {
                            responseMimeType: 'application/json',
                            responseSchema: {
                                type: Type.OBJECT,
                                properties: {
                                    fact: { type: Type.STRING },
                                    emoji: { type: Type.STRING }
                                },
                                required: ['fact', 'emoji']
                            }
                        }
                    });
                    setFunFact(JSON.parse(response.text));
                } catch (error) {
                    console.error("Could not fetch fun fact:", error);
                }
            }
        };
        getFunFact();
    }, [context, language]);

    return (
        <div className="loading-screen">
            <div className="loading-content">
                <AppLogo />
                <p className="loading-text">{text}</p>
            </div>
            {funFact.fact && (
                <div className="loading-fact">
                    <p>
                        <span role="img" aria-label="emoji">{funFact.emoji}</span>
                        {` Fun Fact: ${funFact.fact}`}
                    </p>
                </div>
            )}
        </div>
    );
};
// Fix: Add types for ErrorBoundary props and state
// Fix: Use React.PropsWithChildren to correctly type children prop and resolve component typing issues.
type ErrorBoundaryProps = React.PropsWithChildren<{}>;

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    // Fix: Initialize state using a class property to resolve type errors with `this.state` and `this.props`.
    state: ErrorBoundaryState = { hasError: false, error: null };

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <h1>Oops! Something went wrong.</h1>
                    <p>We encountered an error while processing your request. Please try again.</p>
                    <p><i>{this.state.error?.message || 'An unknown error occurred.'}</i></p>
                    <div className="button-group">
                        <button className="btn" onClick={() => window.location.reload()}>Refresh Page</button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

const InputStep = ({ onContextReady, onLoadFromCode, showLoader, hideLoader, t }) => {
    const [activeTab, setActiveTab] = React.useState('paste');
    const [text, setText] = React.useState('');
    const [topic, setTopic] = React.useState('');
    const [topicLength, setTopicLength] = React.useState('medium');
    const [code, setCode] = React.useState('');
    const [isDragActive, setIsDragActive] = React.useState(false);
    const inputRef = React.useRef(null);

    const processSingleFile = React.useCallback(async (file) => {
        if (!file) return '';

        if (file.type === 'application/pdf') {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onerror = () => reject(new Error("Error reading PDF file."));
                reader.onload = async (e) => {
                    try {
                        // Fix: Add type guard to ensure e.target.result is an ArrayBuffer to resolve overload error.
                        if (!(e.target.result instanceof ArrayBuffer)) {
                            return reject(new Error("Error reading PDF file: result is not an ArrayBuffer."));
                        }
                        const typedarray = new Uint8Array(e.target.result);
                        const pdf = await pdfjsLib.getDocument(typedarray).promise;
                        let fullText = '';
                        for (let i = 1; i <= pdf.numPages; i++) {
                            const page = await pdf.getPage(i);
                            const content = await page.getTextContent();
                            fullText += content.items.map(item => item.str).join(' ');
                        }

                        if (fullText.trim().length < 50) {
                            showLoader(t('pdfOcrFallback'));
                            await new Promise(res => setTimeout(res, 1500));
                            
                            let ocrText = '';
                            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                            for (let i = 1; i <= pdf.numPages; i++) {
                                showLoader(`${t('analyzingImageLoader')} (PDF Page ${i}/${pdf.numPages})`);
                                const page = await pdf.getPage(i);
                                const viewport = page.getViewport({ scale: 2.0 });
                                const canvas = document.createElement('canvas');
                                const context = canvas.getContext('2d');
                                canvas.height = viewport.height;
                                canvas.width = viewport.width;

                                await page.render({ canvasContext: context, viewport: viewport }).promise;
                                const base64Data = canvas.toDataURL('image/jpeg').split(',')[1];
                                
                                const response = await ai.models.generateContent({
                                    model: "gemini-2.5-flash",
                                    contents: { parts: [{ inlineData: { mimeType: 'image/jpeg', data: base64Data } }, { text: "Extract all text from this image." }] },
                                });
                                ocrText += response.text + '\n';
                            }
                            resolve(ocrText);
                        } else {
                            resolve(fullText);
                        }
                    } catch (err) {
                        reject(new Error("Failed to parse PDF file."));
                    }
                };
                reader.readAsArrayBuffer(file);
            });
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onerror = () => reject(new Error("Error reading DOCX file."));
                reader.onload = async (e) => {
                    try {
                        const result = await mammoth.extractRawText({ arrayBuffer: e.target.result });
                        resolve(result.value);
                    } catch (err) {
                        reject(new Error("Failed to parse DOCX file."));
                    }
                };
                reader.readAsArrayBuffer(file);
            });
        } else if (file.type.startsWith('image/')) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onerror = () => reject(new Error("Error reading image file."));
                reader.onload = async (e) => {
                    try {
                        // Fix: Add type guard to ensure e.target.result is a string before calling '.split()'.
                        if (typeof e.target.result !== 'string') {
                            return reject(new Error("Error reading image file: result is not a string."));
                        }
                        const base64Data = e.target.result.split(',')[1];
                        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                        const response = await ai.models.generateContent({
                            model: "gemini-2.5-flash",
                            contents: { parts: [{ inlineData: { mimeType: file.type, data: base64Data } }, { text: "Extract the text from this image." }] },
                        });
                        resolve(response.text);
                    } catch (error) {
                        reject(new Error(`Failed to process image. Error: ${error.message}`));
                    }
                };
                reader.readAsDataURL(file);
            });
        } else {
            alert("Unsupported file type. Please use PDF, DOCX, JPG, or PNG.");
            return Promise.resolve('');
        }
    }, [showLoader, t]);

    const handleFilesSelected = React.useCallback(async (files) => {
        if (!files || files.length === 0) return;
        
        showLoader('Processing files...');
        const allTexts = [];
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            showLoader(`${t('processingFile')} ${i + 1} ${t('of')} ${files.length}: ${file.name}`);
            try {
                const extractedText = await processSingleFile(file);
                if (extractedText && extractedText.trim()) {
                    allTexts.push(extractedText);
                }
            } catch (error) {
                console.error(`Error processing ${file.name}:`, error);
                alert(`Could not process ${file.name}: ${error.message}`);
            }
        }
        
        if (allTexts.length > 0) {
            setText(allTexts.join('\n\n\n--- Document Separator ---\n\n\n'));
            setActiveTab('paste');
        } else if (files.length > 0) {
            alert(t('noTextExtracted'));
        }
        
        hideLoader();
    }, [processSingleFile, showLoader, hideLoader, t]);

    const handleNext = () => text && onContextReady(text);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragActive(true);
        } else if (e.type === "dragleave") {
            setIsDragActive(false);
        }
    };
    
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFilesSelected(e.dataTransfer.files);
        }
    };

    const handleTopicGenerate = async () => {
        if (!topic) return;
        showLoader(`${t('researchingTopicLoader')} "${topic}"...`);
        try {
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
            const lengthMap = {
                short: 'a concise summary of about 600 words',
                medium: 'a comprehensive text of about 1000 words',
                long: 'a detailed and in-depth article of about 2000 words'
            };
            const lengthDescription = lengthMap[topicLength];
            const response = await ai.models.generateContent({
                model: "gemini-2.5-pro",
                contents: `Generate ${lengthDescription} about the topic: "${topic}". The text should be suitable for generating a quiz. It should be informative, well-structured, and cover key aspects of the topic. The output should be plain text, not markdown.`,
            });
            setText(response.text);
            setActiveTab('paste');
        } catch (error) {
            console.error("Error generating text from topic:", error);
            alert("Failed to generate text from the topic.");
        } finally {
            hideLoader();
        }
    };
    
    React.useEffect(() => {
        if (text) hideLoader();
    }, [text, hideLoader]);

    return (
        <div>
            <h2>{t('step1Title')}</h2>
            <div className="tabs">
                <button className={`tab-button ${activeTab === 'paste' ? 'active' : ''}`} onClick={() => setActiveTab('paste')}>{t('pasteTabText')}</button>
                <button className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`} onClick={() => setActiveTab('upload')}>{t('uploadTabText')}</button>
                <button className={`tab-button ${activeTab === 'topic' ? 'active' : ''}`} onClick={() => setActiveTab('topic')}>{t('topicTabText')}</button>
                <button className={`tab-button ${activeTab === 'code' ? 'active' : ''}`} onClick={() => setActiveTab('code')}>{t('loadCodeTabText')}</button>
            </div>
            {activeTab === 'paste' && (
                <textarea className="textarea" placeholder={t('pastePlaceholder')} value={text} onChange={(e) => setText(e.target.value)}></textarea>
            )}
            {activeTab === 'upload' && (
                <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} onClick={() => inputRef.current.click()} className={`drop-zone ${isDragActive ? 'active' : ''}`}>
                    <input ref={inputRef} type="file" hidden onChange={(e) => handleFilesSelected(e.target.files)} accept=".pdf,.docx,.jpg,.jpeg,.png" multiple />
                    <p>{t('dropZoneText')}</p>
                </div>
            )}
            {activeTab === 'topic' && (
                <div>
                     <input type="text" placeholder={t('topicPlaceholder')} value={topic} onChange={e => setTopic(e.target.value)} />
                      <div className="input-group" style={{marginTop: '1.5rem'}}>
                        <label>{t('topicLengthLabel')}</label>
                        <div className="custom-choice-container">
                            {['short', 'medium', 'long'].map(length => (
                                <div className="custom-choice" key={length}>
                                    <input type="radio" id={`len-${length}`} name="topicLength" value={length} checked={topicLength === length} onChange={(e) => setTopicLength(e.target.value)}/>
                                    <label htmlFor={`len-${length}`}>{t(length)}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                     <div style={{marginTop: '1rem'}}><button className="btn" onClick={handleTopicGenerate} disabled={!topic}>{t('generateUseTextButton')}</button></div>
                     {text && activeTab === 'topic' && <textarea className="textarea" style={{marginTop: '1rem'}} value={text} readOnly></textarea>}
                </div>
            )}
            {activeTab === 'code' && (
                <div>
                    <textarea className="textarea" placeholder={t('codePlaceholder')} value={code} onChange={(e) => setCode(e.target.value)}></textarea>
                    <div style={{marginTop: '1rem'}}><button className="btn" onClick={() => onLoadFromCode(code)} disabled={!code}>{t('loadQuizButton')}</button></div>
                </div>
            )}
            <div className="button-group">
                <button className="btn btn-primary" onClick={handleNext} disabled={!text || activeTab === 'code'}>{t('nextButton')}</button>
            </div>
        </div>
    );
};

const OptionsStep = ({ onConfirm, t }) => {
    const [options, setOptions] = React.useState({
        numQuestions: 10,
        questionTypes: ['multiple-choice'],
        correctionStyle: 'after',
        spacedRepetition: false,
        aiChoosesAmount: false,
        difficulty: 'medium',
    });

    const handleTypeChange = (type) => {
        const newTypes = options.questionTypes.includes(type)
            ? options.questionTypes.filter(t => t !== type)
            : [...options.questionTypes, type];
        setOptions({ ...options, questionTypes: newTypes });
    };

    const isConfirmDisabled = options.questionTypes.length === 0;

    const camelCase = (str) => str.replace(/-(\w)/g, (_, c) => c.toUpperCase());

    return (
        <div>
            <h2>{t('step2Title')}</h2>
            <div className="input-group">
                 <div className="toggle-group">
                    <label className="toggle-label">{t('aiChooseAmountLabel')}</label>
                    <label className="toggle-switch">
                        <input type="checkbox" checked={options.aiChoosesAmount} onChange={(e) => setOptions({...options, aiChoosesAmount: e.target.checked})} />
                        <span className="slider"></span>
                    </label>
                </div>
            </div>
            {!options.aiChoosesAmount && (
                <div className="input-group">
                    <label htmlFor="num-questions">{t('numQuestionsLabel')}: {options.numQuestions}</label>
                    <input type="range" id="num-questions" min="5" max="100" value={options.numQuestions} onChange={(e) => setOptions({ ...options, numQuestions: parseInt(e.target.value, 10) })} />
                </div>
            )}
            <div className="input-group">
                <label>{t('questionTypesLabel')}</label>
                <div className="custom-choice-container">
                    {['multiple-choice', 'true-false', 'matching', 'short-answer', 'long-answer', 'fill-in-the-blank'].map(type => (
                        <div className="custom-choice" key={type}>
                            <input type="checkbox" id={type} value={type} checked={options.questionTypes.includes(type)} onChange={() => handleTypeChange(type)} />
                            <label htmlFor={type}>{t(camelCase(type))}</label>
                        </div>
                    ))}
                </div>
            </div>
            <div className="input-group">
                <label>{t('difficultyLabel')}</label>
                <div className="custom-choice-container">
                    {['easy', 'medium', 'hard'].map(level => (
                        <div className="custom-choice" key={level}>
                            <input type="radio" id={`diff-${level}`} name="difficulty" value={level} checked={options.difficulty === level} onChange={(e) => setOptions({ ...options, difficulty: e.target.value })}/>
                            <label htmlFor={`diff-${level}`}>{t(level)}</label>
                        </div>
                    ))}
                </div>
            </div>
             <div className="input-group">
                <label>{t('correctionStyleLabel')}</label>
                <div className="custom-choice-container">
                     {['immediate', 'after', 'both'].map(style => (
                        <div className="custom-choice" key={style}>
                            <input type="radio" id={`corr-${style}`} name="correctionStyle" value={style} checked={options.correctionStyle === style} onChange={(e) => setOptions({ ...options, correctionStyle: e.target.value })}/>
                            <label htmlFor={`corr-${style}`}>{t(style)}</label>
                        </div>
                    ))}
                </div>
            </div>
            <div className="input-group">
                 <div className="toggle-group">
                    <label className="toggle-label">{t('spacedRepetitionLabel')}</label>
                    <label className="toggle-switch">
                        <input type="checkbox" checked={options.spacedRepetition} onChange={(e) => setOptions({...options, spacedRepetition: e.target.checked})} />
                        <span className="slider"></span>
                    </label>
                </div>
            </div>
            <div className="button-group">
                <button className="btn btn-primary" onClick={() => onConfirm(options)} disabled={isConfirmDisabled}>{t('generateQuizButton')}</button>
            </div>
        </div>
    );
};

const FlashcardStep = ({ quizData, onExit, showLoader, hideLoader, t, language }) => {
    const [cards, setCards] = React.useState([]);
    const [initialCards, setInitialCards] = React.useState([]);
    const [incorrectPile, setIncorrectPile] = React.useState([]);
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isFlipped, setIsFlipped] = React.useState(false);
    
    const totalCards = React.useMemo(() => (initialCards.length > 0 ? initialCards.length : 0), [initialCards]);

    React.useEffect(() => {
        const makeCardsConcise = async () => {
            if (!quizData || quizData.length === 0) return;
            showLoader(t('preparingFlashcards'));
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const languageMap = { en: 'English', es: 'Spanish', fr: 'French' };
            const targetLanguage = languageMap[language];

            const conciseCards = await Promise.all(quizData.map(async (q, index) => {
                let question = q.question;
                let answer = '';

                if (q.type === 'matching') {
                    answer = q.matchPairs.map(p => `${p.term}: ${p.definition}`).join('\n');
                } else if (q.type === 'multiple-choice') {
                    answer = q.answer;
                }
                 else {
                    answer = Array.isArray(q.answer) ? q.answer.join(', ') : q.answer;
                }

                if (q.type === 'long-answer' || question.length > 150 || (answer && answer.length > 150)) {
                    const prompt = `Rewrite the following question and answer pair to be more concise for a flashcard. Focus on the key information. Use bullet points or numbered lists (I, II, III) for complex topics. The response MUST be in ${targetLanguage}.
                    
                    Original Question: "${question}"
                    Original Answer: "${answer}"

                    Return ONLY a JSON object with "conciseQuestion" and "conciseAnswer" keys.`;
                    
                    try {
                        const response = await ai.models.generateContent({
                            model: 'gemini-2.5-flash',
                            contents: prompt,
                            config: {
                                responseMimeType: "application/json",
                                responseSchema: {
                                    type: Type.OBJECT,
                                    properties: {
                                        conciseQuestion: { type: Type.STRING },
                                        conciseAnswer: { type: Type.STRING }
                                    },
                                    required: ['conciseQuestion', 'conciseAnswer']
                                }
                            }
                        });
                        const result = JSON.parse(response.text);
                        question = result.conciseQuestion;
                        answer = result.conciseAnswer;
                    } catch (e) {
                        console.error("Could not make card concise, using original.", e);
                    }
                }
                
                return { id: index, question, answer };
            }));
            
            setCards(conciseCards);
            setInitialCards(conciseCards);
            setIncorrectPile([]);
            setCurrentIndex(0);
            hideLoader();
        };

        makeCardsConcise();
    }, [quizData, language, t, showLoader, hideLoader]);

    const currentCard = cards[currentIndex];
    
    const goToNextCard = (wasCorrect) => {
        if (!currentCard) return;

        const newIndex = currentIndex + 1;
        
        if (!wasCorrect) {
            setIncorrectPile(prev => [...prev, currentCard]);
        }

        if (newIndex >= cards.length) {
            // End of the main deck, switch to incorrect pile if it exists
            if (incorrectPile.length > 0) {
                setCards(incorrectPile);
                setIncorrectPile([]);
                setCurrentIndex(0);
            } else {
                // All cards mastered
                setCurrentIndex(cards.length); // Signal completion
            }
        } else {
            setCurrentIndex(newIndex);
        }
        setIsFlipped(false);
    };
    
    const handleStudyAgain = () => {
        setCards(initialCards);
        setCurrentIndex(0);
        setIncorrectPile([]);
        setIsFlipped(false);
    };

    if (cards.length === 0) {
        return null;
    }

    if (currentIndex >= cards.length) {
        return (
            <div className="flashcard-complete">
                <AppLogo/>
                <h2>{t('flashcardsComplete')}</h2>
                <div className="button-group">
                    <button className="btn btn-primary" onClick={handleStudyAgain}>{t('studyAgain')}</button>
                    <button className="btn" onClick={onExit}>{t('exitFlashcards')}</button>
                </div>
            </div>
        );
    }
    
    if (!currentCard) {
        return null;
    }

    return (
        <div className="flashcard-view">
             <div className="flashcard-header">
                <button className="btn" onClick={onExit}>&larr; {t('exitFlashcards')}</button>
                <div className="flashcard-progress">
                    {t('card')} {initialCards.indexOf(currentCard) + 1} {t('of')} {totalCards}
                </div>
            </div>

            <div className="flashcard-scene" onClick={() => setIsFlipped(f => !f)}>
                <div 
                    className={`flashcard ${isFlipped ? 'is-flipped' : ''}`} 
                >
                    <div className="flashcard-face flashcard-face-front">
                        {currentCard.question}
                         <div className="flip-icon" aria-hidden="true">
                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2"/><path d="M8 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 4v16"/><path d="m15 7-3-3-3 3"/><path d="m9 17 3 3 3-3"/></svg>
                        </div>
                    </div>
                    <div className="flashcard-face flashcard-face-back">
                        <div dangerouslySetInnerHTML={{ __html: marked.parse(currentCard.answer || '') }} />
                    </div>
                </div>
            </div>
             <div className="flashcard-actions">
                {!isFlipped ? (
                    <p className="flashcard-hint">{t('flashcardHint')}</p>
                ) : (
                    <div className="button-group">
                        <button className="btn btn-wrong" onClick={() => goToNextCard(false)}>{t('gotItWrong')}</button>
                        <button className="btn btn-right" onClick={() => goToNextCard(true)}>{t('gotItRight')}</button>
                    </div>
                )}
            </div>
        </div>
    );
};

const QuizStep = ({ quizData, onComplete, options, contextText, t }) => {
    const [currentQuizData, setCurrentQuizData] = React.useState([...quizData]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
    const [userAnswers, setUserAnswers] = React.useState(new Array(quizData.length).fill(null).map(() => ({ attempts: [] })));
    const [currentAnswer, setCurrentAnswer] = React.useState(null);
    const [feedback, setFeedback] = React.useState(null);
    const [isGraded, setIsGraded] = React.useState(false);
    const [isGrading, setIsGrading] = React.useState(false);

    // For matching game
    const [selectedTerm, setSelectedTerm] = React.useState(null);
    const [selectedDef, setSelectedDef] = React.useState(null);
    const [correctPairs, setCorrectPairs] = React.useState([]);
    const [matchingIncorrectAttempts, setMatchingIncorrectAttempts] = React.useState(0);
    const [incorrectPair, setIncorrectPair] = React.useState(null);

    const currentQuestion = currentQuizData[currentQuestionIndex];
    
    const shuffledDefs = React.useMemo(() => {
        if (currentQuestion?.type === 'matching' && currentQuestion.matchPairs) {
            return [...currentQuestion.matchPairs.map(p => p.definition)].sort(() => Math.random() - 0.5);
        }
        return [];
    }, [currentQuestion]);

    const resetQuestionState = React.useCallback(() => {
        setIsGraded(false);
        setFeedback(null);
        setIsGrading(false);
        if (currentQuizData[currentQuestionIndex + 1]?.type === 'matching') {
            setCurrentAnswer([]);
            setCorrectPairs([]);
        } else {
            setCurrentAnswer(null);
        }
        setSelectedTerm(null);
        setSelectedDef(null);
        setMatchingIncorrectAttempts(0);
    }, [currentQuestionIndex, currentQuizData]);

    const handleNext = () => {
        if (currentQuestionIndex < currentQuizData.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            resetQuestionState();
        } else {
            onComplete(userAnswers);
        }
    };

    const handleSubmit = async () => {
        if (currentAnswer === null || (Array.isArray(currentAnswer) && currentAnswer.length === 0)) return;
        setIsGrading(true);

        const originalIndex = quizData.findIndex(q => q.question === currentQuestion.question);
        let gradingResult = { isCorrect: false, isPartiallyCorrect: false, feedback: '' };

        try {
            switch (currentQuestion.type) {
                case 'multiple-choice':
                case 'true-false':
                    gradingResult.isCorrect = currentAnswer === currentQuestion.answer;
                    break;
                case 'fill-in-the-blank':
                    gradingResult.isCorrect = currentAnswer.toLowerCase().trim() === currentQuestion.answer.toLowerCase().trim();
                    break;
                case 'matching':
                     // This case is now handled by the auto-submit useEffect
                    break;
                case 'short-answer':
                case 'long-answer':
                    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                    const prompt = `Based on the provided context text, evaluate if the user's answer is correct for the given question and model answer. Your response must be a JSON object with three keys: "isCorrect" (boolean, true if the answer is fully correct), "isPartiallyCorrect" (boolean, true if the answer is on the right track but incomplete or has minor errors), and "feedback" (a string providing a concise explanation for why the answer is correct, partially correct, or incorrect, comparing it to the model answer).

                    Context:
                    ---
                    ${contextText}
                    ---
                    Question: ${currentQuestion.question}
                    Model Answer: ${currentQuestion.answer}
                    User's Answer: ${currentAnswer}`;
                    
                    const response = await ai.models.generateContent({
                        model: 'gemini-2.5-flash',
                        contents: prompt,
                        config: {
                            responseMimeType: 'application/json',
                            responseSchema: {
                                type: Type.OBJECT,
                                properties: {
                                    isCorrect: { type: Type.BOOLEAN },
                                    isPartiallyCorrect: { type: Type.BOOLEAN },
                                    feedback: { type: Type.STRING },
                                },
                                required: ['isCorrect', 'isPartiallyCorrect', 'feedback']
                            }
                        }
                    });
                    const result = JSON.parse(response.text);
                    gradingResult.isCorrect = result.isCorrect;
                    gradingResult.isPartiallyCorrect = result.isPartiallyCorrect;
                    gradingResult.feedback = result.feedback;
                    break;
                default:
                    gradingResult.isCorrect = false;
            }
        } catch (error) {
            console.error("Error during grading:", error);
            alert("An error occurred while grading your answer. Please try again.");
            setIsGrading(false);
            return;
        }
        
        const finalFeedback = gradingResult.feedback || currentQuestion.explanation;
        setFeedback({ ...gradingResult, explanation: finalFeedback });

        const updatedAnswers = [...userAnswers];
        updatedAnswers[originalIndex].attempts.push({
            answer: currentAnswer,
            isCorrect: gradingResult.isCorrect,
            isPartiallyCorrect: gradingResult.isPartiallyCorrect,
            feedback: finalFeedback
        });
        setUserAnswers(updatedAnswers);

        setIsGraded(true);
        setIsGrading(false);
        
        if (options.spacedRepetition && !gradingResult.isCorrect) {
            setCurrentQuizData(prev => [...prev, currentQuestion]);
        }
        
        if (options.correctionStyle === 'after') {
            handleNext();
        }
    };

    React.useEffect(() => {
        if (currentQuestion?.type === 'matching') {
            setCurrentAnswer([]);
        }
    }, [currentQuestionIndex, currentQuestion]);

    const handleMatchSelection = (item, type) => {
        if (isGraded) return;
        
        if (type === 'term') setSelectedTerm(item);
        if (type === 'def') setSelectedDef(item);
    };

    React.useEffect(() => {
        if (selectedTerm && selectedDef) {
            const isCorrect = currentQuestion.matchPairs.some(p => p.term === selectedTerm && p.definition === selectedDef);
            if (isCorrect) {
                setCorrectPairs(prev => [...prev, { term: selectedTerm, def: selectedDef }]);
                setCurrentAnswer(prev => [...(prev || []), {term: selectedTerm, def: selectedDef}]);
            } else {
                setMatchingIncorrectAttempts(prev => prev + 1);
                setIncorrectPair({ term: selectedTerm, def: selectedDef });
                setTimeout(() => setIncorrectPair(null), 500);
            }
            setSelectedTerm(null);
            setSelectedDef(null);
        }
    }, [selectedTerm, selectedDef, currentQuestion]);

    React.useEffect(() => {
        if (
            currentQuestion.type === 'matching' &&
            currentQuestion.matchPairs?.length > 0 &&
            correctPairs.length === currentQuestion.matchPairs.length &&
            !isGraded
        ) {
            setIsGrading(true);
    
            const finalScore = Math.max(0, 5 - matchingIncorrectAttempts);
            const isFullyCorrect = matchingIncorrectAttempts === 0;
    
            const detailedFeedback = `You scored ${finalScore} out of 5 points.${isFullyCorrect ? '' : ` You made ${matchingIncorrectAttempts} incorrect selection(s).`} The correct pairings are shown below:`;
            
            const gradingResult = {
                isCorrect: isFullyCorrect,
                isPartiallyCorrect: !isFullyCorrect,
                feedback: detailedFeedback,
                explanation: detailedFeedback, // for immediate feedback
                scoreDetails: { score: finalScore, total: 5 }
            };
    
            const originalIndex = quizData.findIndex(q => q.question === currentQuestion.question);
            const updatedAnswers = [...userAnswers];
            updatedAnswers[originalIndex].attempts.push({
                answer: correctPairs,
                isCorrect: gradingResult.isCorrect,
                isPartiallyCorrect: gradingResult.isPartiallyCorrect,
                feedback: gradingResult.feedback,
                scoreDetails: gradingResult.scoreDetails
            });
            setUserAnswers(updatedAnswers);
    
            setFeedback(gradingResult);
            setIsGraded(true);
            setIsGrading(false);
    
            if (options.spacedRepetition && !gradingResult.isCorrect) {
                setCurrentQuizData(prev => [...prev, currentQuestion]);
            }
        }
    }, [correctPairs, currentQuestion, isGraded, quizData, userAnswers, matchingIncorrectAttempts, options.spacedRepetition]);

    const renderAnswerField = () => {
        switch (currentQuestion.type) {
            case 'multiple-choice':
                return (
                    <div className="options-list">
                        {currentQuestion.options.map((option, index) => (
                            <button
                                key={index}
                                className={`option-btn 
                                    ${currentAnswer === option ? 'selected' : ''}
                                    ${isGraded && option === currentQuestion.answer ? 'correct' : ''}
                                    ${isGraded && currentAnswer === option && option !== currentQuestion.answer ? 'incorrect' : ''}
                                `}
                                onClick={() => !isGraded && setCurrentAnswer(option)}
                                disabled={isGraded}
                            >
                               {String.fromCharCode(65 + index)}. {option}
                            </button>
                        ))}
                    </div>
                );
            case 'true-false':
                return (
                     <div className="options-list" style={{gridTemplateColumns: '1fr 1fr'}}>
                        {['True', 'False'].map(option => (
                            <button
                                key={option}
                                className={`option-btn 
                                    ${currentAnswer === option ? 'selected' : ''}
                                    ${isGraded && option === currentQuestion.answer ? 'correct' : ''}
                                    ${isGraded && currentAnswer === option && option !== currentQuestion.answer ? 'incorrect' : ''}
                                `}
                                onClick={() => !isGraded && setCurrentAnswer(option)}
                                disabled={isGraded}
                            >
                               {option}
                            </button>
                        ))}
                    </div>
                );
            case 'matching':
                const terms = currentQuestion.matchPairs.map(p => p.term);
                const defs = shuffledDefs;
                
                return (
                    <div className="match-game-container">
                        <div className="match-column">
                             {terms.map(term => {
                                const isPaired = correctPairs.some(p => p.term === term);
                                return (
                                <button key={term}
                                    className={`match-btn ${selectedTerm === term ? 'selected' : ''} ${isPaired ? 'correct' : ''} ${incorrectPair && incorrectPair.term === term ? 'incorrect-selection' : ''}`}
                                    onClick={() => !isPaired && handleMatchSelection(term, 'term')}
                                    disabled={isGraded || isPaired}>
                                    {term}
                                </button>
                             );
                            })}
                        </div>
                         <div className="match-column">
                            {defs.map(def => {
                                const isPaired = correctPairs.some(p => p.def === def);
                                return (
                                <button key={def}
                                    className={`match-btn ${selectedDef === def ? 'selected' : ''} ${isPaired ? 'correct' : ''} ${incorrectPair && incorrectPair.def === def ? 'incorrect-selection' : ''}`}
                                    onClick={() => !isPaired && handleMatchSelection(def, 'def')}
                                    disabled={isGraded || isPaired}>
                                    {def}
                                </button>
                                );
                            })}
                        </div>
                    </div>
                );
            default: // short-answer, long-answer, fill-in-the-blank
                return <textarea className="textarea" placeholder={t('typeYourAnswer')} value={currentAnswer || ''} onChange={(e) => setCurrentAnswer(e.target.value)} readOnly={isGraded} />;
        }
    };
    
    const showFeedback = isGraded && (options.correctionStyle === 'immediate' || options.correctionStyle === 'both');

    return (
        <div>
            <div className="quiz-header">
                <h3>{t('question')} {currentQuestionIndex + 1} {t('of')} {currentQuizData.length}</h3>
            </div>
            <div className="progress-bar">
                <div className="progress-bar-inner" style={{ width: `${((currentQuestionIndex + 1) / currentQuizData.length) * 100}%` }}></div>
            </div>
            <p className="question-text" dangerouslySetInnerHTML={{ __html: marked.parse(currentQuestion.question || '').replace(/<p>|<\/p>/g, '') }}></p>
            {renderAnswerField()}
            
            {showFeedback && feedback && (
                 <div className={`feedback ${feedback.isCorrect ? 'correct' : feedback.isPartiallyCorrect ? 'partially-correct' : 'incorrect'}`}>
                    <h4>
                        {currentQuestion.type === 'matching'
                            ? (feedback.isCorrect ? 'Perfect! 5/5 Points' : `Score: ${feedback.scoreDetails.score}/${feedback.scoreDetails.total} Points`)
                            : (feedback.isCorrect ? 'Correct!' : feedback.isPartiallyCorrect ? 'Partially Correct' : 'Incorrect')}
                    </h4>
                    {currentQuestion.type === 'matching' ? (
                        <div>
                            <p>{feedback.explanation.split('The correct pairings are shown below:')[0]}</p>
                            <div style={{marginTop: '0.5rem', paddingLeft: '1rem', borderLeft: '3px solid var(--border-color)'}}>
                                {currentQuestion.matchPairs.map((pair, i) => (
                                    <p key={i} style={{margin: '0.25rem 0'}}>• <strong>{pair.term}:</strong> {pair.definition}</p>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p>{feedback.explanation}</p>
                    )}
                </div>
            )}

            <div className="button-group">
                {!isGraded && options.correctionStyle !== 'after' ? (
                     <button className="btn btn-primary" onClick={handleSubmit} disabled={isGrading || currentAnswer === null || (Array.isArray(currentAnswer) && currentAnswer.length !== currentQuestion?.matchPairs?.length)}>
                        {isGrading ? t('grading') : t('submitAnswer')}
                    </button>
                ) : (
                     <button className="btn btn-primary" onClick={handleNext}>
                        {currentQuestionIndex < currentQuizData.length - 1 ? t('nextButton') : t('finishQuiz')}
                    </button>
                )}
            </div>
        </div>
    );
};

const regenerateMatchingQuestionsForAudio = async (originalQuizData, contextText, language, t, showLoader, hideLoader) => {
    if (!originalQuizData.some(q => q.type === 'matching')) {
        return originalQuizData;
    }

    showLoader(t('adaptingForAudio'));
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const languageMap = { en: 'English', es: 'Spanish', fr: 'French' };
        const targetLanguage = languageMap[language];
        
        const newQuestionSchema = {
            type: Type.OBJECT,
            properties: {
                question: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['multiple-choice', 'true-false', 'short-answer', 'fill-in-the-blank'] },
                options: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
                answer: { type: Type.STRING },
                explanation: { type: Type.STRING },
                matchPairs: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true }
            },
            required: ['question', 'type', 'answer', 'explanation']
        };

        const regeneratedPromises = originalQuizData.map(async (q) => {
            if (q.type !== 'matching') {
                return q;
            }
            
            const pairsText = q.matchPairs.map(p => `- ${p.term}: ${p.definition}`).join('\n');
            const prompt = `Based on the provided context text, and focusing on the information from the following term/definition pairs, create ONE new audio-friendly quiz question.
The new question type MUST be one of: 'multiple-choice', 'true-false', 'short-answer', 'fill-in-the-blank'. DO NOT create a 'matching' or 'long-answer' question.
The entire output (question, options, answer, explanation) MUST be in ${targetLanguage}.

Term/Definition Pairs:
${pairsText}

Context Text:
---
${contextText.substring(0, 4000)}
---

Return ONLY a JSON object that strictly follows the provided schema. For 'multiple-choice', provide exactly 4 options.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: prompt,
                config: { responseMimeType: 'application/json', responseSchema: newQuestionSchema }
            });

            return JSON.parse(response.text);
        });

        const newQuizData = await Promise.all(regeneratedPromises);
        return newQuizData;

    } catch (error) {
        console.error("Failed to regenerate matching questions:", error);
        alert("Could not adapt matching questions for audio. Using original questions.");
        return originalQuizData; // Fallback to original
    } finally {
        hideLoader();
    }
};


const ExportDropdown = ({ quizData, onEnterFlashcards, onEnterConversationMode, quizOptions, contextText, showLoader, hideLoader, t, language }) => {
    const [modal, setModal] = React.useState(null); 
    const [copied, setCopied] = React.useState(false);

    const handleSaveToCode = () => {
        const dataToSave = {
            quizData,
            options: quizOptions,
            contextText,
        };
        const jsonString = JSON.stringify(dataToSave);
        const encodedString = btoa(encodeURIComponent(jsonString).replace(/%([0-9A-F]{2})/g, (match, p1) => {
            return String.fromCharCode(parseInt(p1, 16));
        }));
        setModal({type: 'code', content: encodedString });
    };

    const handleSaveToPdf = async () => {
        showLoader(t('generatingPdf'));
        const { jsPDF } = jspdf;
        const doc = new jsPDF();
        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;
        const margin = 15;
        let y = margin;
        
        const matchingOrders = {};

        const checkPageBreak = (neededHeight) => {
            if (y + neededHeight > pageHeight - margin) {
                doc.addPage();
                y = margin;
                return true;
            }
            return false;
        };

        // --- RENDER HEADER ---
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(20);
        doc.text('OmniQuiz Examination', pageWidth / 2, y, { align: 'center' });
        y += 15;

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(12);
        const fieldY = y;
        doc.text('Name:', margin, fieldY);
        doc.line(margin + 15, fieldY + 1, margin + 80, fieldY + 1);

        doc.text('Date:', pageWidth - margin - 50, fieldY);
        doc.line(pageWidth - margin - 38, fieldY + 1, pageWidth - margin, fieldY + 1);
        y += 10;
        
        doc.text('Score:', margin, y);
        doc.line(margin + 16, y + 1, margin + 40, y + 1);
        y += 10;
        
        doc.setLineWidth(0.5);
        doc.line(margin, y, pageWidth - margin, y);
        y += 10;

        // --- RENDER QUESTIONS ---
        quizData.forEach((q, index) => {
            checkPageBreak(50); 
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(12);
            const questionText = `${index + 1}. ${q.question}`;
            const questionLines = doc.splitTextToSize(questionText, pageWidth - (margin * 2));
            if (checkPageBreak(questionLines.length * 7) && questionLines.length > 1) {
                doc.setFont('Helvetica', 'bold');
                doc.setFontSize(12);
            }
            doc.text(questionLines, margin, y);
            y += questionLines.length * 7 + 5;

            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(11);

            switch(q.type) {
                case 'multiple-choice':
                    if (q.options) {
                        q.options.forEach((opt, optIndex) => {
                            const optionChar = String.fromCharCode(65 + optIndex);
                            checkPageBreak(10);
                            doc.circle(margin + 4, y, 2.5);
                            const optionText = `${optionChar}) ${opt}`;
                            const optLines = doc.splitTextToSize(optionText, pageWidth - (margin * 2) - 15);
                            doc.text(optLines, margin + 10, y + 1.5);
                            y += optLines.length * 6 + 4;
                        });
                    }
                    break;
                case 'true-false':
                    checkPageBreak(15);
                    doc.rect(margin + 4, y - 2.5, 4, 4);
                    doc.text('True', margin + 12, y);
                    doc.rect(margin + 35, y - 2.5, 4, 4);
                    doc.text('False', margin + 42, y);
                    y += 10;
                    break;
                case 'fill-in-the-blank':
                    checkPageBreak(15);
                    y += 3;
                    doc.setLineWidth(0.2);
                    doc.line(margin, y, margin + 120, y);
                    y += 10;
                    break;
                case 'short-answer':
                    checkPageBreak(35);
                    y += 3;
                    doc.setLineWidth(0.2);
                    for(let i=0; i<3; i++) {
                        doc.line(margin, y, pageWidth - margin, y);
                        y += 8;
                    }
                    break;
                case 'long-answer':
                    checkPageBreak(60);
                    y += 3;
                    doc.setLineWidth(0.2);
                    for(let i=0; i<6; i++) {
                        doc.line(margin, y, pageWidth - margin, y);
                        y += 8;
                    }
                    break;
                case 'matching':
                    if (q.matchPairs) {
                        checkPageBreak(q.matchPairs.length * 15);
                        if (!matchingOrders[index]) {
                            matchingOrders[index] = [...q.matchPairs.map(p => p.definition)].sort(() => Math.random() - 0.5);
                        }
                        const shuffledDefs = matchingOrders[index];
                        const startY = y;
                        let leftY = startY;
                        let rightY = startY;

                        q.matchPairs.forEach((pair, pairIndex) => {
                            const termText = `${pairIndex + 1}. ${pair.term}`;
                            const termLines = doc.splitTextToSize(termText, (pageWidth/2) - margin - 18);
                            doc.text(termLines, margin, leftY);
                            doc.line(margin + (pageWidth/2) - margin - 15, leftY + 1, margin + (pageWidth/2) - margin - 8, leftY + 1);
                            leftY += termLines.length * 6 + 10;
                        });
                        
                        shuffledDefs.forEach((def, defIndex) => {
                            const defChar = String.fromCharCode(65 + defIndex);
                            const defText = `${defChar}. ${def}`;
                            const defLines = doc.splitTextToSize(defText, (pageWidth/2) - (margin * 2));
                            doc.text(defLines, pageWidth / 2, rightY);
                            rightY += defLines.length * 6 + 10;
                        });
                        y = Math.max(leftY, rightY);
                    }
                    break;
            }
            y += 12;
        });

        // --- RENDER ANSWER KEY ---
        doc.addPage();
        y = margin;
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('Answer Key', pageWidth / 2, y, { align: 'center' });
        y += 15;

        quizData.forEach((q, index) => {
            checkPageBreak(30);
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(12);
            
            let answerText = '';
            if (q.type === 'matching' && q.matchPairs) {
                const shuffledDefsForAnswer = matchingOrders[index];
                answerText = q.matchPairs.map((p, i) => {
                    const defIndex = shuffledDefsForAnswer.findIndex(def => def === p.definition);
                    const defChar = String.fromCharCode(65 + defIndex);
                    return `${i + 1} → ${defChar}`;
                }).join(';  ');
            } else {
                answerText = Array.isArray(q.answer) ? q.answer.join(', ') : q.answer;
            }

            const keyText = `${index + 1}. ${answerText}`;
            const keyLines = doc.splitTextToSize(keyText, pageWidth - margin * 2);
            doc.text(keyLines, margin, y);
            y += keyLines.length * 7;

            doc.setFont('Helvetica', 'italic');
            doc.setFontSize(10);
            const explanationLines = doc.splitTextToSize(`Explanation: ${q.explanation}`, pageWidth - margin * 2 - 5);
            doc.text(explanationLines, margin + 5, y);
            y += explanationLines.length * 5 + 8;
        });
        
        doc.save('OmniQuiz_Exam.pdf');
        hideLoader();
    };

    const handleGenerateAudio = async () => {
        const audioFriendlyQuizData = await regenerateMatchingQuestionsForAudio(quizData, contextText, language, t, showLoader, hideLoader);

        const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
        const languageMap = { en: { voice: 'Zephyr' }, es: { voice: 'Puck' }, fr: { voice: 'Charon' } };
        const voiceName = languageMap[language]?.voice || 'Zephyr';

        try {
            const audioBuffers = [];
            const answerSilence = new Uint8Array(24000 * 2 * 10).fill(0); // 10 seconds of silence
            
            for (let i = 0; i < audioFriendlyQuizData.length; i++) {
                const q = audioFriendlyQuizData[i];
                showLoader(`${t('generatingAudioFor')} ${i + 1}/${audioFriendlyQuizData.length}...`);
                
                // 1. Generate and add Question Audio
                let textToSpeak = `Question ${i + 1}. ${q.question}. `;
                 if (q.type === 'multiple-choice' && q.options) {
                    textToSpeak += q.options.map((opt, idx) => `Option ${String.fromCharCode(65 + idx)}: ${opt}.`).join(' ');
                }
                
                const questionResponse = await ai.models.generateContent({
                    model: "gemini-2.5-flash-preview-tts",
                    contents: [{ parts: [{ text: textToSpeak }] }],
                    config: {
                        responseModalities: [Modality.AUDIO],
                        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } }
                    }
                });

                const questionBase64Audio = questionResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
                if (questionBase64Audio) {
                    audioBuffers.push(decode(questionBase64Audio));
                }

                // 2. Add 10s pause for answering
                audioBuffers.push(answerSilence);
                
                // 3. Generate and add Answer Audio
                const answerTextToSpeak = `The correct answer is: ${q.answer}. Explanation: ${q.explanation}`;
                const answerResponse = await ai.models.generateContent({
                    model: "gemini-2.5-flash-preview-tts",
                    contents: [{ parts: [{ text: answerTextToSpeak }] }],
                    config: {
                        responseModalities: [Modality.AUDIO],
                        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } }
                    }
                });

                const answerBase64Audio = answerResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
                if (answerBase64Audio) {
                    audioBuffers.push(decode(answerBase64Audio));
                }

                // 4. Add a short, natural pause before the next question
                if (i < audioFriendlyQuizData.length - 1) {
                     const naturalPause = new Uint8Array(24000 * 2 * 2).fill(0); // 2 seconds of silence
                     audioBuffers.push(naturalPause);
                }
            }
            
            showLoader(t('combiningAudio'));

            // Combine and create WAV
            const totalLength = audioBuffers.reduce((sum, buf) => sum + buf.length, 0);
            const combined = new Uint8Array(totalLength);
            let offset = 0;
            for (const buffer of audioBuffers) {
                combined.set(buffer, offset);
                offset += buffer.length;
            }

            const wavHeader = createWavHeader(totalLength, 24000, 1, 16);
            const wavBlob = new Blob([wavHeader, combined], { type: 'audio/wav' });
            const url = URL.createObjectURL(wavBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'OmniQuiz_Audio.wav';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

        } catch (error) {
             console.error("Error generating audio:", error);
             alert("Failed to generate audio. Please check your API key permissions and try again.");
        } finally {
            hideLoader();
        }
    };
    
    const createWavHeader = (dataLength, sampleRate, numChannels, bitsPerSample) => {
        const buffer = new ArrayBuffer(44);
        const view = new DataView(buffer);
        const writeString = (offset, string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };
        const blockAlign = numChannels * bitsPerSample / 8;
        const byteRate = sampleRate * blockAlign;

        writeString(0, 'RIFF');
        view.setUint32(4, 36 + dataLength, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true); // PCM
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, byteRate, true);
        view.setUint16(32, blockAlign, true);
        view.setUint16(34, bitsPerSample, true);
        writeString(36, 'data');
        view.setUint32(40, dataLength, true);

        return view;
    };


    return (
        <>
        <div className="dropdown">
            <button className="btn">{t('export')} &#9662;</button>
            <div className="dropdown-content">
                <button onClick={handleSaveToPdf}>{t('saveAsPdf')}</button>
                <button onClick={handleGenerateAudio}>{t('generateAudio')}</button>
                <button onClick={handleSaveToCode}>{t('saveToCode')}</button>
                <button onClick={onEnterFlashcards}>{t('exportToFlashcards')}</button>
                <button onClick={onEnterConversationMode}>{t('exportToConversational')}</button>
            </div>
        </div>
        {modal?.type === 'code' && (
            <div className="modal-overlay">
                <div className="modal-content">
                     <h3>{t('yourQuizCode')}</h3>
                     <textarea readOnly value={modal.content}></textarea>
                     <div className="modal-footer">
                         <button className="btn" onClick={() => {
                            navigator.clipboard.writeText(modal.content);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                         }}>{copied ? t('copied') : t('copy')}</button>
                         <button className="btn btn-primary" onClick={() => setModal(null)}>{t('close')}</button>
                     </div>
                </div>
            </div>
        )}
        </>
    );
};

const ResultsStep = ({ results, quizData, onRestart, onTryAgain, t }) => {
    
    const calculateScore = () => {
        return results.reduce((score, result, index) => {
            const lastAttempt = result.attempts[result.attempts.length - 1];
            if (lastAttempt?.isCorrect) {
                return score + 1;
            }
             // For partially correct matching questions, don't add to the main score count, as it's handled separately.
            return score;
        }, 0);
    }
    const score = calculateScore();

    return (
        <div className="results-container">
            <div className="results-summary">
                <div className="results-header">
                    <h2>{t('quizComplete')}</h2>
                </div>
                <div className="score-container">
                    <div>
                        <p>{t('score')}</p>
                        <div className="score">{Math.round((score / quizData.length) * 100)}%</div>
                    </div>
                     <div>
                        <p>{t('correct')}</p>
                        <div className="score">{score} / {quizData.length}</div>
                    </div>
                </div>
                <div className="button-group" style={{gap: '1rem', flexDirection: 'column'}}>
                     <button className="btn" onClick={onTryAgain}>{t('tryAgain')}</button>
                     <button className="btn btn-primary" onClick={onRestart}>{t('createNewQuiz')}</button>
                </div>
            </div>
            
            <div className="results-details">
                <h2>{t('reviewAnswers')}</h2>
                 {quizData.map((q, index) => {
                    const userAnswerData = results[index];
                    const lastAttempt = userAnswerData?.attempts[userAnswerData.attempts.length - 1];
                    const status = lastAttempt?.isCorrect ? 'correct' : lastAttempt?.isPartiallyCorrect ? 'partially-correct' : 'incorrect';
                    
                    let displayAnswer = '';
                    if (lastAttempt?.answer) {
                        if (q.type === 'matching' && Array.isArray(lastAttempt.answer)) {
                            displayAnswer = lastAttempt.answer.map(p => `• ${p.term} -> ${p.def}`).join('\n');
                        } else {
                            displayAnswer = lastAttempt.answer;
                        }
                    }

                    const isMatchingWithScore = q.type === 'matching' && lastAttempt?.scoreDetails;

                    return (
                        <div key={index} className="result-question">
                            <p><strong>{index + 1}. {q.question}</strong></p>
                            {isMatchingWithScore ? (
                                <>
                                    <p>
                                        <span className="attempt-label">{t('yourScore')}:</span> 
                                        <span className={lastAttempt.scoreDetails.score === 5 ? 'correct' : 'partially-correct'}>
                                            {` ${lastAttempt.scoreDetails.score} / ${lastAttempt.scoreDetails.total} ${t('points')}`}
                                        </span>
                                    </p>
                                    <p><span className="attempt-label">{t('correctPairings')}:</span></p>
                                    <div style={{ paddingLeft: '1rem', borderLeft: '3px solid var(--border-color)', marginTop: '0.5rem' }}>
                                        {q.matchPairs.map((pair, i) => (
                                            <p key={i} style={{ margin: '0.25rem 0' }}>• <strong>{pair.term}:</strong> {pair.definition}</p>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p><span className="attempt-label">{t('yourAnswer')}:</span> <span className={status}>{displayAnswer || 'No answer'}</span></p>
                                    {!lastAttempt?.isCorrect && <p><span className="attempt-label">{t('correctAnswer')}:</span> {q.type === 'matching' ? q.matchPairs.map(p=>`• ${p.term}: ${p.definition}`).join('\n') : q.answer}</p>}
                                    <p><span className="attempt-label">{t(lastAttempt?.isCorrect ? 'explanation' : 'aiFeedback')}:</span> <em>{lastAttempt?.feedback || q.explanation}</em></p>
                                </>
                            )}
                        </div>
                    );
                 })}
            </div>
        </div>
    );
};

// Audio helper functions for encoding/decoding
function encode(bytes) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
function decode(base64) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
async function decodeAudioData(data, ctx, sampleRate, numChannels) {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
function createBlob(data) {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

const ConversationStep = ({ quizData, onExit, t, language, contextText, showLoader, hideLoader }) => {
    const [processedQuizData, setProcessedQuizData] = React.useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
    const [gameState, setGameState] = React.useState('initializing');
    const [permissionState, setPermissionState] = React.useState('checking');
    const [transcript, setTranscript] = React.useState([]);
    const [attempts, setAttempts] = React.useState(0);
    const transcriptEndRef = React.useRef(null);

    const sessionPromiseRef = React.useRef(null);
    const inputAudioContextRef = React.useRef(null);
    const mediaStreamRef = React.useRef(null);
    const scriptProcessorRef = React.useRef(null);
    const mediaStreamSourceRef = React.useRef(null);

    const addToTranscript = (speaker, text) => {
        setTranscript(prev => [...prev, { speaker, text, key: Date.now() + Math.random() }]);
    };
    
    React.useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [transcript]);

    const speakAndThen = React.useCallback(async (text, onEndCallback) => {
        if (!text) {
            if (onEndCallback) onEndCallback();
            return;
        }
        setGameState('responding');
        addToTranscript('ai', text);
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const languageMap = { en: 'Zephyr', es: 'Puck', fr: 'Charon' };
        const voiceName = languageMap[language] || 'Zephyr';

        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-preview-tts",
                contents: [{ parts: [{ text }] }],
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } }
                }
            });
            const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
                const outputAudioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
                const decodedBytes = decode(base64Audio);
                const audioBuffer = await decodeAudioData(decodedBytes, outputAudioContext, 24000, 1);
                const source = outputAudioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputAudioContext.destination);
                source.onended = () => {
                    outputAudioContext.close();
                    if (onEndCallback) onEndCallback();
                };
                source.start();
            } else {
                 if (onEndCallback) onEndCallback();
            }
        } catch (error) {
            console.error("TTS Error:", error);
            if (onEndCallback) onEndCallback();
        }
    }, [language]);

    const stopListening = React.useCallback(() => {
        if (sessionPromiseRef.current) {
            sessionPromiseRef.current.then(session => session.close());
            sessionPromiseRef.current = null;
        }
        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current = null;
        }
        if (mediaStreamSourceRef.current) {
            mediaStreamSourceRef.current.disconnect();
            mediaStreamSourceRef.current = null;
        }
    }, []);

    const evaluateAnswer = React.useCallback(async (userAnswer) => {
        const currentQuestion = processedQuizData[currentQuestionIndex];
        const attemptCount = attempts + 1;
        setAttempts(attemptCount);

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const schema = {
            type: Type.OBJECT,
            properties: {
                isCorrect: { type: Type.BOOLEAN },
                feedback: { type: Type.STRING, description: "Feedback for the user. If correct, confirm it. If incorrect, explain why." },
                hint: { type: Type.STRING, nullable: true, description: "A hint for the user if their first attempt is wrong. Null otherwise." },
            },
            required: ['isCorrect', 'feedback']
        };

        const hintPrompt = attemptCount === 1 ? "If the answer is incorrect, provide a brief hint to guide the user to the correct answer for their next attempt." : "Do not provide a hint.";
        const prompt = `Evaluate the user's answer to a quiz question. Context: The user is in an audio quiz. Your response will be spoken back to them. Question: "${currentQuestion.question}". Correct Answer: "${currentQuestion.answer}". User's Answer: "${userAnswer}". Evaluation criteria: 1. Determine if the user's answer is correct. Be lenient with phrasing but strict on the core concepts. 2. Provide brief, conversational feedback. 3. ${hintPrompt}. Return a JSON object with the evaluation.`;

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: prompt,
                config: { responseMimeType: 'application/json', responseSchema: schema }
            });
            const result = JSON.parse(response.text);

            if (result.isCorrect) {
                speakAndThen(result.feedback, () => speakAndThen(currentQuestion.explanation, () => setGameState('next_question')));
            } else {
                if (attemptCount < 2) {
                    const hintText = `That's not quite right. ${result.feedback} Here's a hint: ${result.hint}`;
                    speakAndThen(hintText, () => setGameState('start_listening'));
                } else {
                    const correctionText = `Still not quite there. ${result.feedback} The correct answer is: ${currentQuestion.answer}.`;
                    speakAndThen(correctionText, () => speakAndThen(currentQuestion.explanation, () => setGameState('next_question')));
                }
            }
        } catch (error) {
            console.error("Evaluation error:", error);
            speakAndThen("I had trouble checking your answer. Let's move to the next question.", () => setGameState('next_question'));
        }
    }, [processedQuizData, currentQuestionIndex, attempts, speakAndThen]);
    
    const startListening = React.useCallback(() => {
        if (!mediaStreamRef.current || !inputAudioContextRef.current) return;
        setGameState('listening');
        let accumulatedTranscript = '';
        const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
        const repeatKeywords = ['repeat', 'say that again', 'what was that', 'can you repeat', 'repeat the question'];

        const sessionPromise = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            config: {
                inputAudioTranscription: {},
                responseModalities: [Modality.AUDIO],
            },
            callbacks: {
                onopen: () => {
                    const source = inputAudioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
                    const scriptProcessor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
                    scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                        const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                        const pcmBlob = createBlob(inputData);
                        sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
                    };
                    source.connect(scriptProcessor);
                    scriptProcessor.connect(inputAudioContextRef.current.destination);
                    mediaStreamSourceRef.current = source;
                    scriptProcessorRef.current = scriptProcessor;
                },
                onmessage: (message) => {
                    if (message.serverContent?.inputTranscription) {
                        const text = message.serverContent.inputTranscription.text;
                        accumulatedTranscript += text;
                        const lowerTranscript = accumulatedTranscript.toLowerCase();
                        
                        const saidRepeat = repeatKeywords.some(keyword => lowerTranscript.includes(keyword));
                        if (saidRepeat) {
                            stopListening();
                            setGameState('repeat_question');
                            return;
                        }

                        if (lowerTranscript.includes('done')) {
                            stopListening();
                            const finalAnswer = lowerTranscript.replace(/\bdone\b/g, '').replace(new RegExp(repeatKeywords.join('|'), 'gi'), '').trim();
                            if (finalAnswer) {
                                addToTranscript('user', finalAnswer);
                                setGameState('evaluating');
                                evaluateAnswer(finalAnswer);
                            } else {
                                setGameState('start_listening');
                            }
                        }
                    }
                },
                onerror: (e) => { console.error("Live session error:", e); setGameState('error'); },
                onclose: () => {},
            }
        });
        sessionPromiseRef.current = sessionPromise;
    }, [stopListening, evaluateAnswer]);

    React.useEffect(() => {
        const gameLoop = async () => {
            if (!processedQuizData) return;

            switch (gameState) {
                case 'start_question': {
                    const currentQuestion = processedQuizData[currentQuestionIndex];
                    if (currentQuestion) {
                        setAttempts(0);
                        let questionText = currentQuestion.question;
                        if (currentQuestion.type === 'multiple-choice') {
                            const options = currentQuestion.options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join('. ');
                            questionText += ` Your options are: ${options}`;
                        }
                        await speakAndThen(questionText, () => setGameState('start_listening'));
                    }
                    break;
                }
                case 'repeat_question': {
                    const currentQuestion = processedQuizData[currentQuestionIndex];
                     if (currentQuestion) {
                        let questionText = currentQuestion.question;
                        if (currentQuestion.type === 'multiple-choice') {
                            const options = currentQuestion.options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join('. ');
                            questionText += ` Your options are: ${options}`;
                        }
                        await speakAndThen(questionText, () => setGameState('start_listening'));
                    }
                    break;
                }
                case 'start_listening':
                    startListening();
                    break;
                case 'next_question':
                    if (currentQuestionIndex < processedQuizData.length - 1) {
                        setCurrentQuestionIndex(prev => prev + 1);
                        setGameState('start_question');
                    } else {
                        setGameState('complete');
                        await speakAndThen(t('conversationStatusComplete'), onExit);
                    }
                    break;
                default:
                    // For other states like 'listening', 'evaluating', 'responding' etc. no action is needed here.
                    break;
            }
        };
        gameLoop();
    }, [gameState, currentQuestionIndex, processedQuizData, speakAndThen, startListening, onExit, t]);
    
    React.useEffect(() => {
        async function setup() {
             if (quizData) {
                const audioFriendlyData = await regenerateMatchingQuestionsForAudio(quizData, contextText, language, t, showLoader, hideLoader);
                setProcessedQuizData(audioFriendlyData);
            }
        }
        setup();
    }, [quizData, contextText, language, t, showLoader, hideLoader]);

    React.useEffect(() => {
        async function checkPermissions() {
            if (typeof navigator.permissions?.query !== 'function') {
                setPermissionState('prompt');
                return;
            }
            try {
                // Fix: Cast 'microphone' to PermissionName to fix type error.
                const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
                setPermissionState(permissionStatus.state);
                permissionStatus.onchange = () => {
                    setPermissionState(permissionStatus.state);
                };
            } catch (error) {
                console.error("Could not query microphone permission:", error);
                setPermissionState('prompt');
            }
        }
        checkPermissions();
    }, []);

    React.useEffect(() => {
        if (!processedQuizData || permissionState === 'checking' || permissionState === 'denied') {
            return;
        }

        async function setupAudio() {
            if (permissionState === 'prompt' || permissionState === 'granted') {
                try {
                    inputAudioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
                    if (inputAudioContextRef.current.state === 'suspended') {
                        await inputAudioContextRef.current.resume();
                    }
                    mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
                    setGameState('start_question');
                } catch (err) {
                    console.error("Mic permission denied or error:", err);
                    setPermissionState('denied');
                }
            }
        }
        
        setupAudio();
        
        return () => {
            stopListening();
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(track => track.stop());
            }
            if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
                 inputAudioContextRef.current.close();
            }
        };
    }, [processedQuizData, onExit, stopListening, permissionState]);

    const statusMap = {
        initializing: t('conversationStatusInitializing'),
        asking: t('conversationStatusAsking'),
        listening: t('conversationStatusListening'),
        evaluating: t('conversationStatusEvaluating'),
        responding: t('conversationStatusResponding'),
        complete: t('conversationStatusComplete'),
        error: 'An error occurred.',
    };

    if (permissionState === 'denied') {
        return (
            <div className="conversation-view">
                <div className="conversation-header">
                    <button className="btn" onClick={onExit}>&larr; {t('exitConversation')}</button>
                </div>
                <div className="permission-denied-container">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="2" y1="2" x2="22" y2="22" strokeWidth="2.5"></line>
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                        <line x1="12" y1="19" x2="12" y2="23"></line>
                        <line x1="8" y1="23" x2="16" y2="23"></line>
                    </svg>
                    <h4>{t('permissionDeniedTitle')}</h4>
                    <p>{t('permissionDeniedInfo1')}</p>
                    <p>{t('permissionDeniedInfo2')}</p>
                    <button className="btn" onClick={() => window.location.reload()}>{t('permissionRefreshButton')}</button>
                </div>
            </div>
        );
    }

    if (!processedQuizData || permissionState === 'checking') {
        return (
             <div className="conversation-view">
                 <div className="conversation-orb initializing">
                    <AppLogo />
                </div>
                <p className="conversation-status">{!processedQuizData ? t('adaptingForAudio') : t('checkingPermissions')}</p>
             </div>
        )
    }

    return (
        <div className="conversation-view">
            <div className="conversation-header">
                <button className="btn" onClick={onExit}>&larr; {t('exitConversation')}</button>
                <div className="conversation-progress">{t('question')} {currentQuestionIndex + 1} {t('of')} {processedQuizData.length}</div>
            </div>
            <div className={`conversation-orb ${gameState}`}>
                <AppLogo />
            </div>
            <p className="conversation-status">{statusMap[gameState] || '...'}</p>
            <div className="conversation-transcript">
                {transcript.map((entry) => (
                    <div key={entry.key} className={`transcript-entry ${entry.speaker}`}>
                        <p><strong>{entry.speaker === 'ai' ? 'OmniQuiz' : 'You'}:</strong> {entry.text}</p>
                    </div>
                ))}
                <div ref={transcriptEndRef} />
            </div>
        </div>
    );
};


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </React.StrictMode>
);
