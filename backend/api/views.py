from django.db.models import Sum
from rest_framework import status
from rest_framework.decorators import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import NotFound

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

# Others
import cloudinary
import cloudinary.uploader

# Custom Imports
from api import serializers as api_serializer
from api import models as api_models

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


class ProfileView(generics.RetrieveAPIView):
    serializer_class = api_serializer.ProfileSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = api_models.User.objects.get(id=user_id)
        # Check if the user exists
        return api_models.Profile.objects.get(user=user)

    def get_object(self):
        try:
            user_id = self.kwargs['user_id']
            user = api_models.User.objects.get(id=user_id)
            profile = api_models.Profile.objects.get(user=user)
            return profile
        except (api_models.User.DoesNotExist, api_models.Profile.DoesNotExist):
            raise NotFound("Profile not found")
        
class ProfileUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = api_serializer.ProfileUpdateSerializer
    permission_classes = (AllowAny,)

    def get_object(self):
        try:
            user_id = self.kwargs['user_id']
            user = api_models.User.objects.get(id=user_id)
            profile = api_models.Profile.objects.get(user=user)
            return profile
        except (api_models.User.DoesNotExist, api_models.Profile.DoesNotExist):
            raise NotFound("Profile not found")
        

######################## Post APIs ########################

class CategoryListAPIView(generics.ListAPIView):
    serializer_class = api_serializer.CategorySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return api_models.Category.objects.all()

class PostCategoryListAPIView(generics.ListAPIView):
    serializer_class = api_serializer.PostSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        category_slug = self.kwargs['category_slug'] 
        category = api_models.Category.objects.get(slug=category_slug)
        return api_models.Post.objects.filter(category=category, status="Active")

class PostListAPIView(generics.ListAPIView):
    serializer_class = api_serializer.PostSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return api_models.Post.objects.filter(status='Active').order_by('-date')
    
class PublicPostList(generics.ListAPIView):
    serializer_class = api_serializer.PostSerializer
    permission_classes = (AllowAny,)
    queryset = api_models.Post.objects.all()

    def get_queryset(self):
        return api_models.Post.objects.all().order_by('-date')
    
class PostDetailAPIView(generics.RetrieveAPIView):
    serializer_class = api_serializer.PostSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        slug = self.kwargs['slug']
        post = api_models.Post.objects.get(slug=slug, status="Active")
        post.view += 1
        post.save()
        return post
        
class LikePostAPIView(APIView):
    permission_classes = [AllowAny]
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

        # Check if post has already been liked by this user
        if user in post.likes.all():
            # If liked, unlike post
            post.likes.remove(user)
            return Response({"message": "Post Disliked"}, status=status.HTTP_200_OK)
        else:
            # If post hasn't been liked, like the post by adding user to set of poeple who have liked the post
            post.likes.add(user)
            
            # Create Notification for Author
            api_models.Notification.objects.create(
                user=post.user,
                post=post,
                type="Like",
            )
            return Response({"message": "Post Liked"}, status=status.HTTP_201_CREATED)
        
class PostCommentAPIView(APIView):
    permission_classes = [AllowAny]
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'post_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'name': openapi.Schema(type=openapi.TYPE_STRING),
                'email': openapi.Schema(type=openapi.TYPE_STRING),
                'comment': openapi.Schema(type=openapi.TYPE_STRING),
            },
        ),
    )
    def post(self, request):
        # Getting data from request.data (frontend)
        post_id = request.data['post_id']
        name = request.data['name']
        email = request.data['email']
        comment = request.data['comment']

        post = api_models.Post.objects.get(id=post_id)

        # Create Comment
        api_models.Comment.objects.create(
            post=post,
            name=name,
            email=email,
            comment=comment,
        )

        # Notification
        api_models.Notification.objects.create(
            user=post.user,
            post=post,
            type="Comment",
        )

        # Return response back to the frontend
        return Response({"message": "Commented Sent"}, status=status.HTTP_201_CREATED)
 
class BookmarkPostAPIView(APIView):
    permission_classes = [AllowAny]
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
        user_id = request.data['user_id']
        post_id = request.data['post_id']

        user = api_models.User.objects.get(id=user_id)
        post = api_models.Post.objects.get(id=post_id)

        bookmark = api_models.Bookmark.objects.filter(post=post, user=user).first()
        if bookmark:
            # Remove post from bookmark
            bookmark.delete()
            return Response({"message": "Post Un-Bookmarked"}, status=status.HTTP_200_OK)
        else:
            api_models.Bookmark.objects.create(
                user=user,
                post=post
            )

            # Notification when bookmark happen
            api_models.Notification.objects.create(
                user=post.user,
                post=post,
                type="Bookmark",
            )
            return Response({"message": "Post Bookmarked"}, status=status.HTTP_201_CREATED)

######################## Author Dashboard APIs ########################
class DashboardStatsView(generics.ListAPIView):
    serializer_class = api_serializer.AuthorStats
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = api_models.User.objects.get(id=user_id)

        views = api_models.Post.objects.filter(user=user).aggregate(view=Sum("view"))['view']
        posts = api_models.Post.objects.filter(user=user).count()
        likes = api_models.Post.objects.filter(user=user).aggregate(total_likes=Sum("likes"))['total_likes']
        bookmarks = api_models.Bookmark.objects.all().count()

        return [{
            "views": views,
            "posts": posts,
            "likes": likes,
            "bookmarks": bookmarks,
        }]
    
    def list(self, request, *args, **kwargs):
        querset = self.get_queryset()
        serializer = self.get_serializer(querset, many=True)
        return Response(serializer.data)

class DashboardPostListsView(generics.ListAPIView):
    serializer_class = api_serializer.PostSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = api_models.User.objects.get(id=user_id)

        return api_models.Post.objects.filter(user=user).order_by("-id")

class DashboardCommentListsView(generics.ListAPIView):
    serializer_class = api_serializer.CommentSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = api_models.User.objects.get(id=user_id)
        return api_models.Comment.objects.filter(post__user=user).order_by("-id")

class DashboardNotificationListsView(generics.ListAPIView):
    serializer_class = api_serializer.NotificationSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = api_models.User.objects.get(id=user_id)

        return api_models.Notification.objects.filter(seen=False, user=user)

class DashboardMarkNotiSeenAPIView(APIView):
    permission_classes = [AllowAny]
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'noti_id': openapi.Schema(type=openapi.TYPE_INTEGER),
            },
        ),
    )
    def post(self, request):
        noti_id = request.data['noti_id']
        noti = api_models.Notification.objects.get(id=noti_id)

        noti.seen = True
        noti.save()

        return Response({"message": "Notification Marked As Seen"}, status=status.HTTP_200_OK)

class DashboardPostCreateAPIView(generics.CreateAPIView):
    serializer_class = api_serializer.PostSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        try:
            print(request.data)
            user_id = request.data.get('user_id')
            title = request.data.get('title')
            image = request.data.get('image')
            description = request.data.get('description')
            tags = request.data.get('tags')
            category_id = request.data.get('category')
            post_status = request.data.get('post_status')

            print(user_id)
            print(title)
            print(image)
            print(description)
            print(tags)
            print(category_id)
            print(post_status)

            user = api_models.User.objects.get(id=user_id)
            category = api_models.Category.objects.get(id=category_id)

            post = api_models.Post.objects.create(
                user=user,
                title=title,
                image=image,
                description=description,
                tags=tags,
                category=category,
                status=post_status
            )

            if 'image' in request.FILES:
                post.image = request.FILES['image']
                post.save()

            return Response({"message": "Post Created Successfully",
                            "post": self.serializer_class(post).data}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"message": f"Error creating post: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

class DashboardPostUpdateAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = api_serializer.PostSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        user_id = self.kwargs['user_id']
        post_id = self.kwargs['post_id']
        user = api_models.User.objects.get(id=user_id)
        return api_models.Post.objects.get(user=user, id=post_id)

    def post(self, request, *args, **kwargs):
        try:
            post_instance = self.get_object()
            print('i come in the update section')
            print(request.data)
            # Only update fields that are provided in the request
            if 'title' in request.data:
                post_instance.title = request.data.get('title')
            
            if 'image' in request.FILES:
                # Delete old image from Cloudinary if exists
                if post_instance.image and post_instance.image.public_id:
                    cloudinary.uploader.destroy(post_instance.image.public_id)
                # Upload new image
                post_instance.image = request.FILES['image']
            
            if 'description' in request.data:
                post_instance.description = request.data['description']
            
            if 'tags' in request.data:
                post_instance.tags = request.data['tags']
            
            if 'category' in request.data and request.data['category']:
                try:
                    category = api_models.Category.objects.get(id=request.data['category'])
                    post_instance.category = category
                except api_models.Category.DoesNotExist:
                    return Response(
                        {"message": "Category not found"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            if 'status' in request.data:
                post_instance.status = request.data['status']

            post_instance.save()

            return Response({
                "message": "Post Updated Successfully",
                "data": self.serializer_class(post_instance).data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                "message": f"Error updating post: {str(e)}"
            }, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            instance.delete()
            return Response({
                "message": "Post Deleted Successfully"
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                "message": f"Error deleting post: {str(e)}"
            }, status=status.HTTP_400_BAD_REQUEST)

class DashboardPostDetailAPIView(generics.RetrieveAPIView):
    serializer_class = api_serializer.PostSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        user_id = self.kwargs['user_id']
        post_id = self.kwargs['post_id']
        
        try:
            user = api_models.User.objects.get(id=user_id)
            return api_models.Post.objects.get(user=user, id=post_id)
        except api_models.Post.DoesNotExist:
            raise NotFound("Post not found")
        except api_models.User.DoesNotExist:
            raise NotFound("User not found")

