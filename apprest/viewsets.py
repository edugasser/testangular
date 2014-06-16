from .models import Libro, Autor
from .serializers import LibroSerializer, AutorSerializer
from rest_framework import viewsets
from rest_framework.response import Response
from django.db import connection

#from rest_framework.pagination import PaginationSerializer
from django.template import RequestContext
from url_filter.backend import URLDjangoFilterBackend
from rest_framework.filters import OrderingFilter

class LibroViewSet(viewsets.ModelViewSet):
	
    serializer_class = LibroSerializer
    queryset = Libro.objects.all()


class AutorViewSet(viewsets.ModelViewSet):
	'''serializer_class = AutorSerializer
	model = Autor
	def get_queryset(self):
		"""
		This view should return a list of all the purchases for
		the user as determined by the username portion of the URL.
		"""
		par=self.request.QUERY_PARAMS
		for key in par:
			print key,par[key]
		queryset = Autor.objects.all()

		return queryset
	'''
	serializer_class = AutorSerializer
	queryset = Autor.objects.all()
	filter_backends = (URLDjangoFilterBackend,OrderingFilter)
	filter_fields = ('nombre','apellido')

	ordering_fields = '__all__'

'''
# FUNCIONA EN GRID.JS
class AutorViewSet(viewsets.ModelViewSet):
	serializer_class = AutorSerializer
	model = Autor
	def get_queryset(self):
		"""
		This view should return a list of all the purchases for
		the user as determined by the username portion of the URL.
		"""
		par=self.request.QUERY_PARAMS
		print par
		queryset = Autor.objects.all()

		return queryset
'''
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