import { Component } from '@angular/core';
import { FirebaseService } from '../../shared/services/firebase.service';
import { Router } from '@angular/router';
import { Database, get, push, ref, set } from '@angular/fire/database';
import { ToastAlertService } from '../../shared/services/toast-alert.service';
import { SpinnerService } from '../../shared/services/spinner.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../shared/services/api.service';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-chat-ai',
  standalone: true,
  imports: [FormsModule, CommonModule,MarkdownModule],
  templateUrl: './chat-ai.component.html',
  styleUrl: './chat-ai.component.css'
})
export class ChatAIComponent {

  user: any;
  chats: any;
  activeSection: string = 'AI Chat';
  result: any= `
  Sure! I can help you create an AI application. Here are a few steps to get started:\n\n1. Define the Purpose: Determine the specific problem or task you want the AI application to solve or assist with.\n\n2. Choose the AI Technology: Decide on the type of AI technology you want to use, such as machine learning, natural language processing, computer vision, etc.\n\n3. Data Collection and Preparation: Gather and prepare the data that will be used to train the AI model.\n\n4. Model Training: Train the AI model using the prepared data to make predictions or classifications.\n\n5. Deployment: Deploy the AI model in an application or platform where it can be accessed by users.\n\n6. Testing and Evaluation: Test the AI application to ensure it performs as expected and evaluate its accuracy and performance.\n\n7. Continuous Improvement: Continuously monitor and improve the AI application based on user feedback and 
new data.\n\nIf you have a specific idea or project in mind, feel free to share more details so I can provide more tailored guidance.'} log='Sure! I can help you create an AI application. Here are a few steps to get started:\n\n1. Define the Purpose: Determine the specific problem or task you want the AI application to solve or assist with.\n\n2. Choose the AI Technology: Decide on the type of AI technology you want to use, such as machine learning, natural language processing, computer vision, etc.\n\n3. Data Collection and Preparation: Gather and prepare the data that will be used to train the AI model.\n\n4. Model Training: Train the AI model using the prepared data to make predictions or classifications.\n\n5. Deployment: Deploy the AI model in an application or platform where it can be accessed by users.\n\n6. Testing and Evaluation: Test the AI application to ensure it performs as expected and evaluate its accuracy and performance.\n\n7. Continuous Improvement: Continuously monitor and improve the AI application based on user feedback and new data.\n\nIf you have a specific idea or project in mind, feel free to share more details so I can provide more 
tailored guidance.'

Top 5 Sources:

1. [Reference 1](https://www.apsy.io/)
   Our AI app builder, Apsy Assist, allows users to create apps for social media, e-commerce, online education, service marketplaces, and dating. For more complex app ideas requiring integration with external systems or APIs, our expert team utilizes AI technology. Get started with building your app today.

2. [Reference 2](https://bubble.io/ai-app-generator)
   Bubble's AI app generator allows users to quickly build powerful apps without coding by generating step-by-step guides and creating frontends based on natural-language prompts. Users can get started for free.

3. [Reference 3](https://vercel.com/guides/how-to-build-ai-app)
   The content discusses examples of AI apps, the importance of identifying the problem before building an AI app, and provides a recommended tech stack for building an AI application. It also mentions the availability of a Next.js AI Chatbot template and the ease of building AI apps with advancements in technology like OpenAI's GPT-4 and Replicate's cloud-hosted models.

4. [Reference 4](https://bubble.io/)
   Bubble allows users to create apps without coding, connecting to AI models like ChatGPT or Claude in under 5 minutes. With Bubble, developers can deploy their first GPT-powered app in days instead of months, streamlining the app development process.

5. [Reference 5](https://shivlab.com/blog/how-to-create-an-ai-application/)
   Developing an AI app requires robust back-end infrastructure to handle data processing without latency issues. Proper data allocation for training, validation, and testing is crucial for image 
recognition. Continuous improvement involves updating AI models based on new data and user feedback for future adaptability.


Overall Summary:
The AI app builder mentioned in the information helps users create apps for various purposes such as social media, e-commerce, online education, service marketplaces, and dating. Apsy Assist is recommended for more complex app ideas that require integration with external systems or APIs. Bubble's AI app generator allows for the creation of powerful apps quickly without coding. Various types of AI apps can be built using tools like Next.js and the Vercel AI SDK. The process of building an AI app involves identifying the problem, selecting the right tech stack, fine-tuning the model, and continuously improving the app based on new data and user feedback.`

  constructor(
    public fauth: FirebaseService,
    private router: Router,
    public db: Database,
    private toastService: ToastAlertService,
    private spinnerService: SpinnerService,
    private apiService: ApiService
  ) {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('user')) {
      this.user = localStorage.getItem('user');
      this.user = JSON.parse(this.user);
    }
  }

  async ngOnInit() {
    const userRef = ref(this.db, `users/${this.user.uid}/info`);
    const userSnapshot = await get(userRef);
    const profile = userSnapshot.val()
    if (profile.department == undefined || profile.interests == undefined || profile.skills == undefined) {
      this.toastService.showToast('Please complete your profile first', 'error', 'top-end');
      this.router.navigate(['profile', this.user.displayName]);
    }
    this.getChat();
  }

  setActiveSection(section: string) {
    this.activeSection = section;
    if (section === 'AI Chat') {
      this.getChat();
    }
    if (section === 'news') {
      this.recentNews();
    }
  }

  async getChat() {
    const chatRef = ref(this.db, `users/${this.user.uid}/chat`);
    const chatSnapshot = await get(chatRef);
    const chat = chatSnapshot.val()
    const chatArray = Object.keys(chat).map(key => ({
      key: key,
      question: chat[key].question,
      response: chat[key].response
    }));
    this.chats = chatArray;
  }


  async getProfile(){
    const userRef = ref(this.db, `users/${this.user.uid}/info`);
    const snapshot = await get(userRef);
    const user_data = snapshot.val();
    return user_data
  }

  async sendMessage(prompt: any) {
    this.spinnerService.show();
    try {
      const user_data = await this.getProfile()
      const response$ = await this.apiService.generate(prompt, user_data);
      response$.subscribe(
        response => {
          this.spinnerService.hide();
          console.log('AI Response:', response);
          this.result = response;
          if (response.choices.length > 0) {
            this.saveChat(prompt, response.choices[0].text);
          }
        },
        error => {
          this.spinnerService.hide();
          console.error('Error generating response:', error);
        }
      );
    } catch (error) {
      this.spinnerService.hide();
      console.error('Error retrieving auth token:', error);
    }
  }

  async saveChat(question: string, response: string) {
    const chatRef = ref(this.db, `users/${this.user.uid}/chat`);
    const createdAt = new Date().toISOString();
    const chatData = {
      [createdAt]: {
        question,
        response
      }
    };
    await set(chatRef, chatData)
      .then(() => {
        this.getChat();
      })
      .catch((error) => {
        console.error('Error saving chat:', error);
      });
  }

  async recentNews() { 
    this.spinnerService.show();
    try {
      const user_data = await this.getProfile()
      const response$ = await this.apiService.recentNews(user_data);
      response$.subscribe(
        response => {
          this.spinnerService.hide();
          console.log('Recent News:', response);
          
            // "return_values={'output': 'Sure, I can help you create an AI application. Could you please provide more details about the specific type of AI application you want to develop? For example, do you want to create a chatbot, a recommendation system, a computer vision application, or something else? Please provide as much information as possible so I can assist you effectively.'} log='Sure, I can help you create an AI application. Could you please provide more details about the specific type of AI application you want to develop? For example, do you want to create a chatbot, a recommendation system, a computer vision application, or something else? Please provide as much information as possible so I can assist you effectively.'\n\nTop 5 Sources:\n\n1. [Reference 1](https://www.appypie.com/ai-app-generator)\n   Create an AI app without coding by using Appy Pie AI App Generator. Describe your app with voice or text commands, then customize the design and save. This platform allows for app creation without the need for coding skills.\n\n2. [Reference 2](https://www.apsy.io/)\n   AI app builder Apsy Assist allows for creation of apps for social media, e-commerce, education, and dating. Expert team can integrate complex ideas with external systems and APIs using AI technology. Get started with building your app today.\n\n3. [Reference 3](https://vercel.com/guides/how-to-build-ai-app)\n   The content discusses examples of AI apps, the importance of identifying the problem before building an AI app, and provides a tech stack for building an AI application. It also mentions a Next.js AI Chatbot template and the process of fine-tuning the AI model using off-the-shelf models.\n\n4. [Reference 4](https://bubble.io/)\n   Bubble allows users to create apps without coding, connecting to AI models like ChatGPT and Claude in minutes. This platform enables developers to deploy GPT-powered apps in days instead of months, significantly reducing development time.\n\n5. [Reference 5](https://shivlab.com/blog/how-to-create-an-ai-application/)\n   Developing an AI app requires robust back-end infrastructure to handle data processing. Proper data allocation is key for training, validation, and testing. Continuous improvement involves updating AI models based on new data and user feedback.\n\n\nOverall Summary:\nThe information provides steps and tips for creating an AI app without coding using tools like Appy Pie AI App Generator and Apsy Assist. It also discusses identifying the problem, selecting a tech stack, fine-tuning the model, and continuous improvement. Examples of AI apps and companies in the AI space are also mentioned, showcasing the possibilities and potential in the field."
          
          const news = response.response;
          this.result = news.output;

        },
        error => {
          this.spinnerService.hide();
          console.error('Error retrieving recent news:', error);
        }
      );
    } catch (error) {
      this.spinnerService.hide();
      console.error('Error retrieving auth token:', error);
    }
  }

}
