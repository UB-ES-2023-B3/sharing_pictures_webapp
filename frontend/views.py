from django.shortcuts import render
from django.http import JsonResponse

# Create your views here.
def index(request,*args,**kwargs):
    return render(request, 'frontend/index.html')

#def register(request,*args,**kwargs):
#    return render(request, 'frontend/register.html')