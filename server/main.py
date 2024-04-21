import os
import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv
load_dotenv()

class ImageURL(BaseModel):
    img_url: str


app = FastAPI()

origins = [
    "*"
]
app.add_middleware(
    CORSMiddleware, allow_origins=origins, allow_methods=["*"], allow_headers=["*"]
)

API_KEY = os.getenv("API_KEY")

def analyze_image(image_url: str):

    print(image_url)
    print(type(image_url))

    # Construct the API endpoint URL
    endpoint = 'https://eastus.api.cognitive.microsoft.com/vision/v3.2/analyze'
    params = {
        'visualFeatures': 'Tags,Adult'
    }

    headers = {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': API_KEY
    }

    payload = {
        'url': image_url
    }

    response = requests.post(endpoint, headers=headers, params=params, json=payload)

    # Check if the request was successful
    if response.status_code == 200:
        # Process the response
        print(response)
        data = response.json()
        return data
    else:
        # Handle the error
        error_message = f'Error: {response.status_code} - {response.text}'
        raise HTTPException(status_code=response.status_code, detail=error_message)



@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/is-adult-content/")
async def check_for_adult_content(img_url: ImageURL):
    
    try:
        result = analyze_image(img_url.img_url)

        return result['adult']['isAdultContent'] or result['adult']['isRacyContent'] or result['adult']['isGoryContent']
    
    except HTTPException as e:
        raise e