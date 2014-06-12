from .models import Libro, Autor
from .serializers import LibroSerializer, AutorSerializer
from rest_framework import viewsets
from rest_framework.response import Response
from django.db import connection
from django.core.paginator import Paginator
from rest_framework.pagination import PaginationSerializer
itemsPerPage=3

class LibroViewSet(viewsets.ModelViewSet):
	
    serializer_class = LibroSerializer
    queryset = Libro.objects.all()


class AutorViewSet(viewsets.ModelViewSet):
    queryset = Autor.objects.all()
    serializer_class = AutorSerializer
    paginate_by = 10
    paginate_by_param = 'page'
    max_paginate_by = 100


'''
class AutorViewSet(viewsets.ModelViewSet):
	serializer_class = AutorSerializer
	model = Autor
	#queryset = Autor.objects.all()
	def get_queryset(self):
		pactual = self.request.QUERY_PARAMS.get('page', None)
		offset=(itemsPerPage*(int(pactual)-1))
		print pactual,offset
		cursor = connection.cursor()
		cursor.execute((SELECT *
			FROM apprest_autor		
			LIMIT %s OFFSET %s) % (itemsPerPage,offset))
		grid=dictfetchall(cursor)
		print grid

		return grid

	def get_queryset(self):
		page = self.request.QUERY_PARAMS.get('page', None)
		serializer = PaginationSerializer(instance=page)
		serializer.data'''
