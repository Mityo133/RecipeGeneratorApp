import translate from 'google-translate-api-x'

export async function translateToEnglish(message:string){
    try{
        const result = await translate(`${message}`, { to: 'en' });
        console.log(result.text);  
        return {
            translation: result.text,
            detectedLanguage: result.from.language.iso,
            originalText: message
        };
    }catch(er){
        throw new Error('There was an error with your translating');
    }
}