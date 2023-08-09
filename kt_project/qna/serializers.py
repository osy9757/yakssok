from rest_framework import serializers
from .models import qna

class QnaSerializer(serializers.ModelSerializer):

    class Meta:

        model = qna

        fields = ['user_info', 'question', 'user_img']





class Qna_A_Serializer(serializers.ModelSerializer):

    class Meta:

        model = qna

        fields = ['no', 'user_info', 'question', 'answer_info', 'answer']