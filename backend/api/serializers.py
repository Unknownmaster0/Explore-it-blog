from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import cloudinary
import cloudinary.uploader

from api import models as api_models

# Define a custom serializer that inherits from TokenObtainPairSerializer
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    # Define a custom method to get the token for a user
    def get_token(cls, user):
        print(user)
        # Call the parent class's get_token method
        token = super().get_token(user)

        # Add custom claims to the token
        token['full_name'] = user.full_name
        token['email'] = user.email

        # Return the token with custom claims
        return token

# Define a serializer for user registration, which inherits from serializers.ModelSerializer
class RegisterSerializer(serializers.ModelSerializer):
    # Define fields for the serializer, including password and password2
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        # Specify the model that this serializer is associated with
        model = api_models.User
        # Define the fields from the model that should be included in the serializer
        fields = ('full_name', 'email',  'password', 'password2')

    def validate(self, attrs):
        # Define a validation method to check if the passwords match
        if attrs['password'] != attrs['password2']:
            # Raise a validation error if the passwords don't match
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        # Return the validated attributes
        return attrs

    def create(self, validated_data):
        # Define a method to create a new user based on validated data
        user = api_models.User.objects.create(
            full_name=validated_data['full_name'],
            email=validated_data['email'],
        )
        email_username, mobile = user.email.split('@')
        user.username = email_username

        # Set the user's password based on the validated data
        user.set_password(validated_data['password'])
        user.save()

        # Return the created user
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = api_models.User
        fields = '__all__'

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = api_models.Profile
        fields = '__all__'
        
    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['user'] = UserSerializer(instance.user).data
        # Add the image_url field to the response
        if not response.get('image_url') and instance.image:
            response['image_url'] = instance.image.url
        return response
    
class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = api_models.Profile
        fields = ['image', 'bio', 'about', 'country', 'facebook', 'twitter']
        extra_kwargs = {
            'image': {'required': False},
            'bio': {'required': False},
            'about': {'required': False},
            'country': {'required': False},
            'facebook': {'required': False},
            'twitter': {'required': False},
        }

    def update(self, instance, validated_data):
        # if image is updated, update the image_url too.
        if 'image' in validated_data:
            uploaded_image = cloudinary.uploader.upload(validated_data['image'], folder='blog_posts/')
            instance.image = uploaded_image
            # Save the instance to update the image_url field in the database
            instance.save()
            instance.image_url = uploaded_image['secure_url']

        for field, value in validated_data.items():
            # Only update fields that were actually provided
            if value is not None:
                setattr(instance, field, value)
        instance.save()
        return instance

class CategorySerializer(serializers.ModelSerializer):
    post_count = serializers.SerializerMethodField()

    def get_post_count(self, category):
        return category.posts.count()
    
    class Meta:
        model = api_models.Category
        fields = [
            "id",
            "title",
            "image",
            "slug",
            "post_count",
        ]

    def __init__(self, *args, **kwargs):
        super(CategorySerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.method == 'POST':
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = api_models.Comment
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super(CommentSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.method == 'POST':
            self.Meta.depth = 0
        else:
            self.Meta.depth = 1


class PostSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True)
    
    class Meta:
        model = api_models.Post
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(PostSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.method == 'POST':
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3

    def to_representation(self, instance):
        response = super().to_representation(instance)
        # Add the image_url field to the response
        if not response.get('image_url') and instance.image:
            response['image_url'] = instance.image.url
        # include likes count
        response['likes_count'] = instance.likes.count()
        return response

class PostUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = api_models.Post
        fields = ['title', 'description', 'category', 'tags', 'status', 'image']
        extra_kwargs = {
            'title': {'required': False},
            'description': {'required': False},
            'category': {'required': False},
            'tags': {'required': False},
            'status': {'required': False},
            'image': {'required': False},
        }

    def update(self, instance, validated_data):
        # if image is updated, update the image_url too.
        if 'image' in validated_data:
            instance.image = validated_data.pop('image')

        for field, value in validated_data.items():
            # Only update fields that were actually provided
            if value is not None:
                setattr(instance, field, value)
        instance.save()
        return instance

class BookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = api_models.Bookmark
        fields = "__all__"


    def __init__(self, *args, **kwargs):
        super(BookmarkSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.method == 'POST':
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3
    
class NotificationSerializer(serializers.ModelSerializer):  
    class Meta:
        model = api_models.Notification
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super(NotificationSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.method == 'POST':
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3

class AuthorStats(serializers.Serializer):
    views = serializers.IntegerField(default=0)
    posts = serializers.IntegerField(default=0)
    likes = serializers.IntegerField(default=0)
    bookmarks = serializers.IntegerField(default=0)