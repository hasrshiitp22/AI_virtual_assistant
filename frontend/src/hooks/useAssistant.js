const { startAssistant } = useAssistant({
    assistantName: userData.assistantName,
    getgemini
});

useEffect(() => {
    startAssistant();
}, []);