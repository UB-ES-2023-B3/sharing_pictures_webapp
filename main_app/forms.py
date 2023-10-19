from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import get_user_model
from .models import CustomUser
from .models import Post
from django.core.exceptions import ValidationError

class RegistrationForm(UserCreationForm):
    email = forms.EmailField(help_text='A valid email address, please.', required=True)

    class Meta:
        model = get_user_model()
        fields = ['email', 'username', 'password1', 'password2', 'first_name', 'last_name']

    def save(self, commit=True):
        user = super(RegistrationForm, self).save(commit=False)
        user.email = self.cleaned_data['email']
        if commit:
            user.save()

        return user

# US2.1
class LoginForm(AuthenticationForm):
    def __init__(self, *args, **kwargs):
        super(LoginForm, self).__init__(*args, **kwargs)

    username = forms.CharField(widget=forms.TextInput(
        attrs={'class': 'form-control', 'placeholder': 'Email'}),
        label="Email")

    password = forms.CharField(widget=forms.PasswordInput(
        attrs={'class': 'form-control', 'placeholder': 'Password'}))
    class Meta:
        model = get_user_model()
        fields = ['username', 'password']

#Classe especial de Django que permet crear formularis basats directament en un model. 
#En lloc de definir manualment cada camp del formulari
#Django utilitzarà la definició del model per generar automàticament els camps del formulari. 
class UploadPostForm(forms.ModelForm):
    #classe Meta defineix quines propietats del model s'han d'incloure en el formulari.
    class Meta:
        model = Post
        fields = ['image', 'description']

    description = forms.CharField(required=False, widget=forms.Textarea)
                                  
    #Mètode que s'executa automàticament per netejar i validar el camp image del teu formulari.
    def clean_image(self):
        image = self.cleaned_data.get('image')

        if image:
            # Validar l'extensió del fitxer
            ext = image.name.split('.')[-1].lower()
            if ext not in ['jpg', 'jpeg', 'png']:
                raise ValidationError('El format d’imatge no està suportat. Utilitzi JPG, JPEG o PNG.')

            # Validar la mida del fitxer
            if image.size > 100 * 1024 * 1024:  # 100MB
                raise ValidationError('La imatge és massa gran. La mida màxima permesa és 100MB.')

        return image
