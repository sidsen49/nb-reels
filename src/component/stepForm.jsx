import React from 'react';
import axios from 'axios';


import './stepFormCss.css'

import { formSteps, textConstant } from './constants';

const StepForm = ({ setBlog }) => {

  const [ formData, setFormData] = React.useState(formSteps);
  const [ selectedStep, selectStep ] = React.useState(0);
  const [ isLoader, setLoader ] = React.useState(false);

  const steps = Object.keys(formData);

  const setFormValue = (step, type, value) => {
    const newFormData = {...formData};
    if (type === 'text') {
      const stepDataClone = newFormData[step];
      stepDataClone.value = value;
      setFormData(newFormData);
    }
  }

  const incrementStep = () => {
    if (selectedStep === 0) videoJsonData()
    if (selectedStep === steps.length-1) {selectStep(0)}
    else selectStep(selectedStep + 1);
  }

  const exportData = () => {
    incrementStep();
    const exportData = {};
    formData?.step2?.components.forEach((element, index) => {
      exportData[`frame#${index+1}`] = {
        audioFile: element[`frame${index + 1}`]?.audiofile?.value,
        imageFile: element[`frame${index + 1}`]?.imageFile?.value, 
      }
    })
    axios.post('https://34.87.125.23:8002/save-files/', exportData, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {

    }).catch((error) => {

    })
  } 

  const addAudioFiles = async (text, prevText, nextText) => {
    return axios.post('https://api.elevenlabs.io/v1/text-to-speech/NmIr4NXT9TpJ2BCIEno9/with-timestamps?output_format=mp3_44100_128',
      {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
          "stability": 0.48,
          "similarity_boost": 0.69,
          "style": 0.49,
          "use_speaker_boost": true
        },
        "previous_text": prevText,
        "next_text": nextText,
        "apply_text_normalization": "auto"
      },
      {
        headers: {
          'xi-api-key': 'sk_1f81e650bbb06302bd49bddcb3f2cff733fefcd129a75950',
          'Content-Type': 'application/json'
        }
      }
    ).then((response) => response).catch((error) => error);
  }

  const getImageFiles = (text) => {
    return axios.post('https://34.87.125.23:8001/predict', {
        "prompt": text,
        "width": 512,
        "height": 912,
        "num_steps": 4,
        "guidance": 0,
        "seed": 0
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      }
    } ).then((response) => response).catch((e) => e)
  }

  const addCompleteData = (reelLength, response, reel_content) => {
    const newFormData = {...formData}
    const components = [];
    const audioFiles = [];
    const imageFiles = [];
    for(let i = 0; i < reelLength; i++) {
      audioFiles.push(response[i]?.data?.audio_base64)
    } 

    for(let i = reelLength; i < response.length; i++ ) {
      imageFiles.push(response[i]?.data?.image);
    }
    Object.keys(reel_content).forEach((element, index) => {
      const frameObject = { [`frame${index+1}`]: {
        voiceOverTextNormalized: {
          type: 'textBox',
          value: reel_content[element]['Voice-over Text Normalized'],
          change: false,
        },
        visualPromt: {
          type: 'textBox',
          value: reel_content[element]['Visual Prompt'],
          change: false
        },
        audiofile: {
          type: 'audio',
          value: audioFiles[index]
        },
        imageFile: {
          type: 'image',
          value: imageFiles[index],
          seed: ''
        }
      }}
      components.push(frameObject);
    });
    newFormData.step2['components'] = [...components]
    setFormData(newFormData);
  }
  
  const addFrameData = (reel_content = []) => {
    setLoader(true);
    const audioContentPromise = [];
    const imageContentPromise = [];
    const frameList = Object.keys(reel_content)
    frameList.forEach((element, index) => {
      imageContentPromise.push(getImageFiles(reel_content[element]['Visual Prompt']));
      if (index === 0) {
        audioContentPromise.push(addAudioFiles(reel_content[element]['Voice-over Text Normalized'], '', reel_content[frameList[index + 1]]['Voice-over Text Normalized']));
      } else if (frameList.length - 1 === index) {
        audioContentPromise.push(addAudioFiles(reel_content[element]['Voice-over Text Normalized'], reel_content[frameList[index - 1]]['Voice-over Text Normalized'], ''));
      } else {
        audioContentPromise.push(addAudioFiles(reel_content[element]['Voice-over Text Normalized'], reel_content[frameList[index - 1]]['Voice-over Text Normalized'], reel_content[frameList[index + 1]]['Voice-over Text Normalized']));
      }
    })
    Promise.all([...audioContentPromise, ...imageContentPromise]).then((response) => {
      addCompleteData(frameList.length, response, reel_content);
      setLoader(false);
    }).catch((e) => {
      console.error(e);
    })
  }

  const videoJsonData = async () => {
    try {
      setLoader(true);
      const response = await axios.post('https://34.87.125.23:8000/generate_reel/',
        {"url": `${formData.step1.value}`},
        { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      )
      addFrameData(response?.data?.reel_content)
    } catch(e) {
      console.error(e);
    }
  }

  const updateAudioImage = (step, index, frameName, length) => {
    const currentText = formData[step].components[index][frameName].voiceOverTextNormalized.value;
    const imageText = formData[step].components[index][frameName].visualPromt.value;
    const nextText = index !== length ? formData[step].components[index + 1][`frame${(index + 1)+1}`].voiceOverTextNormalized.value : '' ;
    const prevText = index !== 0 ? formData[step].components[index -1][`frame${(index + 1) - 1}`].voiceOverTextNormalized.value : '';
    addAudioFiles(currentText, prevText, nextText).then((data) => {
      const newFormData = { ...formData };
      newFormData[step].components[index][frameName].voiceOverTextNormalized.change = false;
      newFormData[step].components[index][frameName].visualPromt.change = false;
      newFormData[step].components[index][frameName].audiofile.value = data?.data?.audio_base64;
      setFormData(newFormData);
    }).catch((e) => {
      console.error(e)
    })
    getImageFiles(imageText).then((data) => {
      const newFormData = { ...formData };
      newFormData[step].components[index][frameName].voiceOverTextNormalized.change = false;
      newFormData[step].components[index][frameName].visualPromt.change = false;
      newFormData[step].components[index][frameName].imageFile.value = data?.data?.image;
      setFormData(newFormData);
    }).catch((e) => {
      console.error(e);
    })
  }

  const frameTextChange = (step, index, key, value, stepName) => {
    const newFormData = {...formData};
    const newComponents = [...newFormData[step].components];
    newComponents[index][stepName][key].value = value;
    newComponents[index][stepName][key].change = true;
    newFormData[step].components = [...newComponents];
    setFormData(newFormData);
  }


  console.log(formData);
  return <>
  {isLoader ? <><div className='overLayScreen'>
  </div>
  <div class="loader"></div></> : null}
  <div className={'formContainer'}>
    <div className='headerSection'>
      {steps.map((step, index) => {
        return <><div className='roundCircle' key={`${step}-${index}`}>
          <div className='stepName'>
            {formSteps[step].name}
          </div>
          {index <= selectedStep ? <div className='innerCircle'>
          </div> : null}
          </div>{steps.length -1 !== index ? <div className='straightLine'></div> : null}</>
      })}
    </div>
    <div className={`${selectedStep === 1 ? 'formBodyStyle1' : 'formBody'}`}>
      {
        formData[steps[selectedStep]].type === 'text' ? <>
        <p className='headerText'>{formData[steps[selectedStep]].name}</p>
        <input type='text' className='textInputStyle' placeholder={formData[steps[selectedStep]].placeholder} value={formData[steps[selectedStep]].value} onChange={(e) => {setFormValue(steps[selectedStep], formData[steps[selectedStep]].type, e.target.value)}} />
        </> : null
      }
      {
        formData[steps[selectedStep]].type === 'group' ? <>
        {
          formData[steps[selectedStep]].components.map((eachStep, index) => {
            return <div className='groupOuterContainer'>
              <p>{textConstant[Object.keys(eachStep)[0]]}</p>
              <div className='groupContainer'>
                <div className='frameGroups'>
                  <p>{textConstant['voiceOverTextNormalized']}</p>
                  <textarea className='textAreaStyle' onChange={(e) => {frameTextChange(steps[selectedStep], index , 'voiceOverTextNormalized', e.target.value, Object.keys(eachStep)[0])}}>{
                    eachStep[Object.keys(eachStep)[0]].voiceOverTextNormalized.value
                  }</textarea>
                  <p>{textConstant['visualPromt']}</p>
                  <textarea className='textAreaStyle' onChange={(e) => {frameTextChange(steps[selectedStep], index , 'visualPromt', e.target.value, Object.keys(eachStep)[0])}}>{
                    eachStep[Object.keys(eachStep)[0]].visualPromt.value
                  }</textarea>
                </div>
                <div className='frameGroups' style={{marginLeft: '7%'}}>
                  <p>{textConstant['audiofile']}</p>
                  <audio src={`data:audio/mpeg;base64,${eachStep[Object.keys(eachStep)[0]].audiofile.value}`} controls/>
                </div>
                <div className='frameGroups'>
                <p>{textConstant['imageFile']}</p>
                  <img src={`data:image/png;base64,${eachStep[Object.keys(eachStep)[0]].imageFile.value}`} alt='frameImage' className='frameImage' />
                </div>
              </div>
              {eachStep[Object.keys(eachStep)[0]]?.voiceOverTextNormalized.change || eachStep[Object.keys(eachStep)[0]]?.visualPromt.change ? <button className='submitChange' onClick={() => {updateAudioImage(steps[selectedStep], index, Object.keys(eachStep)[0], formData[steps[selectedStep]].components?.length)}}>Submit Change</button> : null}
            </div>
          })
        }
        </> : null
      }
      {
        formData[steps[selectedStep]].type === 'video' ? 
        <div className='step3Container'>
          <video src='/sample.mp4' width="320" height="240" type="video/mp4" controls />
          <button className='blogButton' onClick={() => {setBlog(true)}}>Check blog</button>
        </div>
        : null
      }
    </div>
    {selectedStep !== 2 ? <button className='buttonStyle' onClick={
     selectedStep === 1 ? exportData : formData.step1.value ? 
      incrementStep :  () => {}
      }>{selectedStep === 1 ? 'Export' : 'Continue'}</button> : null}
  </div></>
}

export default StepForm
