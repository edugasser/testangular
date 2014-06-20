from django.shortcuts import render
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponse,HttpResponseRedirect
from django.core.serializers.json import DjangoJSONEncoder
from .models import Libro, Autor
import datetime,json

from django.core import serializers

# Create your views here.
def dame_autores(request):
	lista=Autor.objects.all()

	#data=json.dumps(lista,cls=DjangoJSONEncoder)
	data = serializers.serialize("json", lista)
	return HttpResponse(data,content_type = "application/json")