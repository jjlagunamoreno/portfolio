from rest_framework.decorators import api_view
from rest_framework.response import Response

PROFILE = {
    "name": "Jaime Jesús Laguna Moreno",
    "role": "Full-Stack Developer",
    "location": "Madrid, España",
    "bio": (
        "Desarrollador Full-Stack con experiencia en frontend (React, Angular, "
        "Vue) y backend (Python y .NET). Apasionado por la tecnología, la "
        "optimización de sistemas y la automatización de procesos."
    ),
    "links": {
        "github": "https://github.com/jjlagunamoreno",
        "linkedin": "https://www.linkedin.com/in/jaime-laguna-moreno/",
        "email": "jjlagunamoreno@gmail.com",
    },
}


@api_view(["GET"])
def health(request):
    return Response({"status": "ok"})


@api_view(["GET"])
def profile(request):
    return Response(PROFILE)
