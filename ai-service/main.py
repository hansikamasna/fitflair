from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from gradio_client import Client, handle_file
from color_recommender import recommend_bottoms

import shutil
import os
import uuid

app = FastAPI()

# Allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Folder for outputs
os.makedirs("processed", exist_ok=True)


# =====================================================
# HOME ROUTE
# =====================================================
@app.get("/")
def home():
    return {"status": "AI Service Running"}


# =====================================================
# COLOR THEORY AI STYLIST ROUTE
# =====================================================
@app.get("/recommend/{top_color}")
def recommend_color(top_color: str):
    try:
        result = recommend_bottoms(top_color)

        return {
            "success": True,
            "data": result
        }

    except Exception as e:
        print("RECOMMEND ERROR:", str(e))
        return {
            "success": False,
            "error": str(e)
        }


# =====================================================
# FREE AI TRY-ON ROUTE
# =====================================================
@app.post("/ai-tryon")
async def ai_tryon(
    mannequin: UploadFile = File(...),
    cloth: UploadFile = File(...)
):
    try:
        mannequin_path = f"processed/{uuid.uuid4()}_{mannequin.filename}"
        cloth_path = f"processed/{uuid.uuid4()}_{cloth.filename}"

        with open(mannequin_path, "wb") as f:
            shutil.copyfileobj(mannequin.file, f)

        with open(cloth_path, "wb") as f:
            shutil.copyfileobj(cloth.file, f)

        client = Client("yisol/IDM-VTON")

        result = client.predict(
            dict={
                "background": handle_file(mannequin_path),
                "layers": [],
                "composite": None
            },
            garm_img=handle_file(cloth_path),
            garment_des="fashion top",
            is_checked=True,
            is_checked_crop=False,
            denoise_steps=30,
            seed=42,
            api_name="/tryon"
        )

        output_img = result[0]

        return JSONResponse({
            "success": True,
            "imageUrl": output_img
        })

    except Exception as e:
        print("TRYON ERROR:", str(e))
        return {
            "success": False,
            "error": str(e)
        }