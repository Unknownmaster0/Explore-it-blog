from django.shortcuts import render
from django.http import JsonResponse
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.db.models import Sum
# Restframework
from rest_framework import status
from rest_framework.decorators import api_view, APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from datetime import datetime

# Others
import json
import random

# Custom Imports
from api import serializers as api_serializer
from api import models as api_models

# user releated views
class MyTokenObtainPairView(TokenObtainPairView):
    # Here, it specifies the serializer class to be used with this view.
    serializer_class = api_serializer.MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    # It sets the queryset for this view to retrieve all User objects.
    queryset = api_models.User.objects.all()
    # It specifies that the view allows any user (no authentication required).
    permission_classes = (AllowAny,)
    # It sets the serializer class to be used with this view.
    serializer_class = api_serializer.RegisterSerializer

class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = api_serializer.ProfileSerializer

    def get_object(self):
        user_id = self.kwargs['user_id']

        user = api_models.User.objects.get(id=user_id)
        profile = api_models.Profile.objects.get(user=user)
        return profile
    
# post views

class CategoryListApiView(generics.ListAPIView):
    serializer_class = api_serializer.CategorySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return api_models.Category.objects.all()
    
class PostCategoryListApiView(generics.ListAPIView):
    serializer_class = api_serializer.PostSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        category_slug = self.kwargs['category_slug']
        category = api_models.Category.objects.get(slug=category_slug)
        return api_models.Post.objects.filter(category=category, status='Active').order_by('-created_at')
    
class PostListApiView(generics.ListAPIView):
    serializer_class = api_serializer.PostSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return api_models.Post.objects.all().order_by('-created_at')
    
class PostDetailApiView(generics.RetrieveAPIView):
    serializer_class = api_serializer.PostSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        slug = self.kwargs['slug']
        post = api_models.Post.objects.get(slug=slug, status='Active')
        post.view += 1
        post.save()
        return post;

class LikePostApiView(APIView):
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'user_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'post_id': openapi.Schema(type=openapi.TYPE_INTEGER),
            },
        ),
    )

    def post(self, request):
        user_id = request.data.get('user_id')
        post_id = request.data.get('post_id')

        user = api_models.User.objects.get(id=user_id)
        post = api_models.Post.objects.get(id=post_id)

        if user in post.likes.all():
            post.likes.remove(user)
            post.save()
            return Response({'message': 'Post unliked successfully'}, status=status.HTTP_200_OK)
        else:
            post.likes.add(user)
            post.save()
            api_models.Notification.objects.create(user=post.user, post=post, type='Like')
            return Response({'message': 'Post liked successfully'}, status=status.HTTP_201_CREATED)
        
class PostCommentApiView(APIView):
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'post_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'name' : openapi.Schema(type=openapi.TYPE_STRING),
                'email' : openapi.Schema(type=openapi.TYPE_STRING),
                'comment' : openapi.Schema(type=openapi.TYPE_STRING),
            },
        ),
    )

    def post(self, request):
        post_id = request.data.get('post_id')
        name = request.data.get('name')
        email = request.data.get('email')
        comment = request.data.get('comment')

        post = api_models.Post.objects.get(id=post_id)

        api_models.Comment.objects.create(post=post, name=name, email=email, comment=comment)

        api_models.Notification.objects.create(user=post.user, post=post, type='Comment')

        return Response({'message': 'Comment added successfully'}, status=status.HTTP_201_CREATED)
    
class BookmarkPostApiView(APIView):
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'user_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'post_id': openapi.Schema(type=openapi.TYPE_STRING),
            },
        ),
    )

    def post(self, request):
        user_id = request.data.get('user_id')
        post_id = request.data.get('post_id')

        user = api_models.User.objects.get(id=user_id)
        post = api_models.Post.objects.get(id=post_id)

        bookmark = api_models.Bookmark.objects.filter(user=user, post=post).first()

        if bookmark:
            bookmark.delete()
            return Response({'message': 'Post removed from bookmarks'}, status=status.HTTP_200_OK)
        else:
            api_models.Bookmark.objects.create(user=user, post=post)

        api_models.Notification.objects.create(user=post.user, post=post, type='Bookmark')

        return Response({'message': 'Post bookmarked successfully'}, status=status.HTTP_201_CREATED)
    
    