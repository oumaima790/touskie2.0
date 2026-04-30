<template>
  <v-app style="background:#0e203a">
    <!-- NAVBAR -->
    <v-app-bar color="#071426" elevation="0" height="64">
      <v-container class="d-flex align-center py-0" style="max-width:1400px;background:#071426">
        <div style="cursor:pointer" @click="$router.push('/')">
          <span style="font-size:22px;font-weight:800;color:#f97316">Touskie</span>
          <span style="font-size:11px;color:#a8b3c4;margin-left:6px;letter-spacing:2px">B2B</span>
        </div>

        <div class="d-flex ml-8">
          <v-menu>
            <template #activator="{ props }">
              <v-btn v-bind="props" variant="text" class="text-capitalize" style="color:#ccc;font-size:15px">
                Categories <v-icon end size="18">mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list style="background:#071426;color:white">
              <v-list-item v-for="cat in categories" :key="cat.name" @click="$router.push('/listings')">
                <v-list-item-title style="color:white">{{ cat.icon }} {{ cat.name }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>

        <v-spacer />

        <v-btn variant="text" class="text-capitalize mr-1" style="color:#ccc;font-size:15px" @click="$router.push('/login')">
          Log In
        </v-btn>
        <v-btn variant="text" class="text-capitalize mr-3" style="color:#ccc;font-size:15px" @click="$router.push('/signup')">
          Sign Up
        </v-btn>
        <v-btn color="#f97316" class="text-white text-capitalize font-weight-bold" rounded="lg" size="large" @click="$router.push('/signup')">
          Post a Project
        </v-btn>
      </v-container>
    </v-app-bar>

    <v-main style="background:#0e203a;min-height:100vh">
      <!-- HERO -->
      <div style="background:linear-gradient(135deg,#071426 0%,#0e203a 100%);padding:90px 20px 80px;text-align:center">
        <h1 style="color:white;font-size:52px;font-weight:800;margin-bottom:16px;line-height:1.15">
          Find the right consultant<br />for your business
        </h1>
        <p style="color:rgba(255,255,255,0.7);font-size:18px;margin-bottom:40px">
          Connect with top experts or let our AI guide you to the right solution
        </p>

        <!-- SEARCH BAR -->
        <div style="max-width:700px;margin:0 auto;background:#071426;border:1px solid rgba(255,255,255,0.08);border-radius:12px;display:flex;align-items:center;padding:6px 6px 6px 0;box-shadow:0 8px 30px rgba(0,0,0,0.3)">
          <select
            v-model="selectedCategory"
            style="border:none;outline:none;padding:10px 16px;font-size:14px;color:white;background:#071426;border-right:1px solid rgba(255,255,255,0.12);cursor:pointer;min-width:170px"
          >
            <option value="">All Categories</option>
            <option v-for="cat in categories" :key="cat.name" :value="cat.name">
              {{ cat.icon }} {{ cat.name }}
            </option>
          </select>
          <input
            v-model="search"
            placeholder="Search for a service or consultant..."
            style="flex:1;border:none;outline:none;font-size:15px;background:transparent;color:white;padding:10px 16px"
          />
          <v-btn color="#f97316" class="text-white text-capitalize font-weight-bold" size="large" rounded="lg">
            <v-icon class="mr-1">mdi-magnify</v-icon> Search
          </v-btn>
        </div>

        <!-- POPULAR TAGS -->
        <div style="margin-top:24px">
          <span style="color:rgba(255,255,255,0.5);font-size:14px;margin-right:12px">Popular:</span>
          <v-chip
            v-for="tag in popularTags"
            :key="tag"
            class="mr-2"
            style="background:rgba(249,115,22,0.2);color:white;cursor:pointer;border:1px solid rgba(249,115,22,0.4)"
            size="small"
          >
            {{ tag }}
          </v-chip>
        </div>
      </div>

      <v-container v-if="currentView !== 'welcome'" style="max-width:1200px;padding:40px 20px;background:#0e203a">
        <v-row class="mb-6" align="center">
          <v-col cols="12" class="d-flex align-center justify-space-between">
            <div>
              <h2 class="text-h4 font-weight-bold" style="color:white">
                {{ currentView === 'signup' ? 'Sign Up to Post a Project' : 'Post a Project' }}
              </h2>
              <div style="color:#a8b3c4">
                {{ currentView === 'signup' ? 'Please create an account to continue.' : 'Complete your listing details below.' }}
              </div>
            </div>
            <v-btn variant="text" color="#f97316" @click="resetView">Back to home</v-btn>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="8">
            <Signup
              v-if="currentView === 'signup'"
              embedded
              @signedUp="onSignupSuccess"
            />
            <ListingForm
              v-else-if="currentView === 'postProject'"
              @listingCreated="onListingCreated"
            />
          </v-col>
        </v-row>
      </v-container>

      <!-- STATS BAR -->
      <div style="background:#071426;padding:24px 20px;border-bottom:1px solid rgba(255,255,255,0.08)">
        <v-container style="max-width:900px;background:#071426">
          <v-row justify="center" align="center">
            <v-col cols="auto" class="text-center px-8">
              <div style="font-size:28px;font-weight:800;color:#f97316">2,500+</div>
              <div style="font-size:13px;color:#a8b3c4">Expert Consultants</div>
            </v-col>
            <v-divider vertical style="height:40px;border-color:rgba(255,255,255,0.08)" />
            <v-col cols="auto" class="text-center px-8">
              <div style="font-size:28px;font-weight:800;color:#f97316">98%</div>
              <div style="font-size:13px;color:#a8b3c4">Satisfaction Rate</div>
            </v-col>
            <v-divider vertical style="height:40px;border-color:rgba(255,255,255,0.08)" />
            <v-col cols="auto" class="text-center px-8">
              <div style="font-size:28px;font-weight:800;color:#f97316">48h</div>
              <div style="font-size:13px;color:#a8b3c4">Avg. Response Time</div>
            </v-col>
            <v-divider vertical style="height:40px;border-color:rgba(255,255,255,0.08)" />
            <v-col cols="auto" class="text-center px-8">
              <div style="font-size:28px;font-weight:800;color:#f97316">10k+</div>
              <div style="font-size:13px;color:#a8b3c4">Projects Completed</div>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <!-- CATEGORIES -->
      <v-container style="max-width:1200px;padding:60px 20px;background:#0e203a">
        <h2 style="font-size:28px;font-weight:700;margin-bottom:8px;color:white">Browse by category</h2>
        <p style="color:#a8b3c4;margin-bottom:32px">Find the right expert for your specific need</p>
        <v-row>
          <v-col v-for="cat in categories" :key="cat.name" cols="6" sm="4" md="3">
            <v-card
              rounded="lg"
              elevation="0"
              border
              class="pa-4 text-center"
              style="cursor:pointer;transition:all 0.2s;background:#071426;color:white;border-color:rgba(255,255,255,0.08)"
              @mouseenter="e => e.currentTarget.style.borderColor='#f97316'"
              @mouseleave="e => e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'"
              @click="$router.push('/listings')"
            >
              <div style="font-size:32px;margin-bottom:8px">{{ cat.icon }}</div>
              <div style="font-size:14px;font-weight:600;color:white">{{ cat.name }}</div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- FEATURED LISTINGS -->
      <div style="background:#0e203a;padding:60px 20px">
        <v-container style="max-width:1200px;background:#0e203a">
          <h2 style="font-size:28px;font-weight:700;margin-bottom:8px;color:white">Featured opportunities</h2>
          <p style="color:#a8b3c4;margin-bottom:32px">Top business assets and projects available now</p>
          <v-row>
            <v-col v-for="(product, index) in products" :key="index" cols="12" sm="6" md="3">
              <v-card rounded="lg" elevation="0" border style="cursor:pointer;overflow:hidden;background:#071426;color:white;border-color:rgba(255,255,255,0.08)" @click="addToListings(product)">
                <v-img :src="product.image" height="160" cover />
                <v-card-text class="pb-1">
                  <div style="font-size:13px;color:#f97316;font-weight:600;margin-bottom:4px">{{ product.category }}</div>
                  <div style="font-size:14px;font-weight:600;color:white;line-height:1.4">{{ product.name }}</div>
                </v-card-text>
                <v-card-actions class="pt-0 px-4 pb-3">
                  <div style="font-size:13px;font-weight:700;color:#a8b3c4">{{ product.price }}</div>
                  <v-spacer />
                  <v-btn size="small" color="#f97316" class="text-white text-capitalize" rounded="lg">View</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <!-- HOW IT WORKS -->
      <div style="background:#0e203a;padding:80px 20px">
        <v-container style="max-width:1200px;background:#0e203a">
          <div style="text-align:center;margin-bottom:60px">
            <h2 style="font-size:36px;font-weight:800;margin-bottom:12px;color:white">Make it real with Touskie</h2>
            <p style="color:#a8b3c4;font-size:18px">Everything you need to get your business moving</p>
          </div>
          <v-row>
            <v-col v-for="feature in features" :key="feature.title" cols="12" sm="6" md="3">
              <div style="text-align:center;padding:20px">
                <div style="font-size:48px;margin-bottom:20px">{{ feature.icon }}</div>
                <h3 style="font-size:18px;font-weight:700;margin-bottom:12px;color:white">{{ feature.title }}</h3>
                <p style="color:#a8b3c4;font-size:14px;line-height:1.7">{{ feature.desc }}</p>
              </div>
            </v-col>
          </v-row>
          <div style="text-align:center;margin-top:40px">
            <v-btn color="#f97316" class="text-white text-capitalize font-weight-bold" size="x-large" rounded="xl" @click="$router.push('/signup')">
              Get started now →
            </v-btn>
          </div>
        </v-container>
      </div>

      <!-- TAP INTO GLOBAL TALENT -->
      <div style="background:#0e203a;padding:80px 20px">
        <v-container style="max-width:1200px;background:#0e203a">
          <v-row align="center">
            <v-col cols="12" md="5">
              <div style="font-size:13px;font-weight:700;letter-spacing:2px;color:#f97316;margin-bottom:16px">HOW IT WORKS</div>
              <h2 style="font-size:36px;font-weight:800;margin-bottom:40px;line-height:1.2;color:white">Tap into a global talent network</h2>
              <div v-for="(step, i) in steps" :key="step.title" style="display:flex;align-items:flex-start;margin-bottom:32px">
                <div style="min-width:40px;height:40px;background:#f97316;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:16px;margin-right:16px">
                  {{ i + 1 }}
                </div>
                <div>
                  <h3 style="font-size:17px;font-weight:700;margin-bottom:6px;color:white">{{ step.title }}</h3>
                  <p style="color:#a8b3c4;font-size:14px;line-height:1.7">{{ step.desc }}</p>
                </div>
              </div>
              <v-btn color="#f97316" class="text-white text-capitalize font-weight-bold mt-4" size="large" rounded="xl" @click="$router.push('/signup')">
                Create the future →
              </v-btn>
            </v-col>
            <v-col cols="12" md="7">
              <v-row>
                <v-col v-for="(product, index) in products.slice(0,4)" :key="index" cols="6">
                  <v-card rounded="xl" elevation="0" border style="overflow:hidden;cursor:pointer;background:#071426;color:white;border-color:rgba(255,255,255,0.08)">
                    <v-img :src="product.image" height="180" cover />
                    <v-card-text class="pa-3">
                      <div style="font-size:12px;color:#f97316;font-weight:600">{{ product.category }}</div>
                      <div style="font-size:13px;font-weight:600;color:white">{{ product.name }}</div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <!-- SKILLS CLOUD -->
      <div style="background:#071426;padding:80px 20px">
        <v-container style="max-width:1200px;text-align:center;background:#071426">
          <h2 style="font-size:36px;font-weight:800;color:white;margin-bottom:12px">Get work done in 500+ categories</h2>
          <p style="color:#a8b3c4;margin-bottom:48px;font-size:16px">Whatever your business needs, we have an expert for it</p>
          <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center">
            <v-chip
              v-for="skill in skills"
              :key="skill"
              style="background:rgba(249,115,22,0.1);color:#ccc;cursor:pointer;border:1px solid rgba(249,115,22,0.2)"
              @mouseenter="e => e.currentTarget.style.background='rgba(249,115,22,0.25)'"
              @mouseleave="e => e.currentTarget.style.background='rgba(249,115,22,0.1)'"
            >
              {{ skill }}
            </v-chip>
          </div>
          <v-btn variant="outlined" class="text-capitalize mt-10" style="color:#f97316;border-color:#f97316" size="large" rounded="xl">
            View all categories
          </v-btn>
        </v-container>
      </div>

      <!-- STATS TRUST -->
      <div style="background:#f97316;padding:60px 20px;text-align:center">
        <v-container style="max-width:900px;background:#f97316">
          <v-row justify="center">
            <v-col cols="6" md="3" class="text-center">
              <div style="font-size:36px;font-weight:800;color:white">87M+</div>
              <div style="color:rgba(255,255,255,0.85);font-size:14px;margin-top:4px">Registered Users</div>
            </v-col>
            <v-col cols="6" md="3" class="text-center">
              <div style="font-size:36px;font-weight:800;color:white">25M+</div>
              <div style="color:rgba(255,255,255,0.85);font-size:14px;margin-top:4px">Projects Posted</div>
            </v-col>
            <v-col cols="6" md="3" class="text-center">
              <div style="font-size:36px;font-weight:800;color:white">2,700+</div>
              <div style="color:rgba(255,255,255,0.85);font-size:14px;margin-top:4px">Skill Categories</div>
            </v-col>
            <v-col cols="6" md="3" class="text-center">
              <div style="font-size:36px;font-weight:800;color:white">80%</div>
              <div style="color:rgba(255,255,255,0.85);font-size:14px;margin-top:4px">Bids in 60 seconds</div>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <!-- ENTERPRISE -->
      <div style="background:#071426;padding:80px 20px">
        <v-container style="max-width:1200px;background:#071426">
          <div style="text-align:center;margin-bottom:60px">
            <div style="font-size:13px;font-weight:700;letter-spacing:2px;color:#f97316;margin-bottom:16px">FOR ORGANIZATIONS</div>
            <h2 style="color:white;font-size:36px;font-weight:800;margin-bottom:12px">Power your organisation's competitive advantage</h2>
            <p style="color:#a8b3c4;font-size:16px;max-width:600px;margin:0 auto">Scale your business with access to top consultants and enterprise-grade tools</p>
          </div>
          <v-row>
            <v-col v-for="plan in enterprise" :key="plan.title" cols="12" md="4">
              <v-card
                rounded="xl"
                elevation="0"
                border
                class="pa-6"
                style="height:100%;cursor:pointer;transition:all 0.2s;background:#0e203a;color:white;border-color:rgba(255,255,255,0.08)"
                @mouseenter="e => e.currentTarget.style.borderColor='#f97316'"
                @mouseleave="e => e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'"
              >
                <div style="font-size:36px;margin-bottom:16px">{{ plan.icon }}</div>
                <h3 style="font-size:20px;font-weight:700;margin-bottom:12px;color:white">{{ plan.title }}</h3>
                <p style="color:#a8b3c4;font-size:14px;line-height:1.7;margin-bottom:24px">{{ plan.desc }}</p>
                <a style="color:#f97316;font-weight:600;font-size:14px;cursor:pointer;text-decoration:none">View more →</a>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <!-- AI CTA -->
      <div style="background:#071426;padding:80px 20px;text-align:center">
        <div style="font-size:13px;font-weight:700;letter-spacing:2px;color:#f97316;margin-bottom:16px">✨ POWERED BY AI</div>
        <h2 style="font-size:36px;font-weight:800;margin-bottom:16px;color:white">Not sure where to start?</h2>
        <p style="color:rgba(255,255,255,0.6);font-size:18px;max-width:500px;margin:0 auto 36px;line-height:1.7">
          Our AI assistant will ask you a few questions and guide you to the right consultant — for free.
        </p>
        <v-btn color="#f97316" class="text-white text-capitalize font-weight-bold" size="x-large" rounded="xl">
          Chat with AI Assistant →
        </v-btn>
      </div>

      <!-- FOOTER -->
      <v-footer color="#071426" class="py-8">
        <v-container style="max-width:1200px;background:#071426">
          <v-row>
            <v-col cols="12" md="4">
              <span style="color:#f97316;font-weight:800;font-size:20px">Touskie</span>
              <span style="color:#a8b3c4;margin-left:8px;font-size:11px;letter-spacing:2px">B2B</span>
              <p style="color:#a8b3c4;font-size:13px;margin-top:12px;line-height:1.7">
                Strategic marketplace connecting businesses with top consultants.
              </p>
            </v-col>
            <v-col cols="6" md="2">
              <div style="color:#888;font-size:12px;font-weight:700;letter-spacing:1px;margin-bottom:16px">PLATFORM</div>
              <div v-for="link in ['How it works','Pricing','Enterprise','Consultants']" :key="link"
                style="color:#ccc;font-size:14px;margin-bottom:10px;cursor:pointer">{{ link }}</div>
            </v-col>
            <v-col cols="6" md="2">
              <div style="color:#888;font-size:12px;font-weight:700;letter-spacing:1px;margin-bottom:16px">COMPANY</div>
              <div v-for="link in ['About','Blog','Careers','Press']" :key="link"
                style="color:#ccc;font-size:14px;margin-bottom:10px;cursor:pointer">{{ link }}</div>
            </v-col>
            <v-col cols="12" md="4">
              <div style="color:#888;font-size:12px;font-weight:700;letter-spacing:1px;margin-bottom:16px">CATEGORIES</div>
              <div v-for="cat in categories.slice(0,5)" :key="cat.name"
                style="color:#ccc;font-size:14px;margin-bottom:10px;cursor:pointer">
                {{ cat.icon }} {{ cat.name }}
              </div>
            </v-col>
          </v-row>
          <v-divider style="border-color:rgba(255,255,255,0.08);margin:32px 0" />
          <div style="color:#777;font-size:13px;text-align:center">
            © 2026 Touskie B2B — Global Sourcing & Consulting
          </div>
        </v-container>
      </v-footer>
    </v-main>
  </v-app>
</template>

<script>
import solar from "../assets/images/solar.jpg"
import warehouse from "../assets/images/warehouse.jpg"
import steel from "../assets/images/steel.jpg"
import consulting from "../assets/images/consulting.jpg"
import hydrogen from "../assets/images/hydrogen.jpg"
import logistics from "../assets/images/logistics.jpg"
import agriculture from "../assets/images/agriculture.jpg"
import datacenter from "../assets/images/datacenter.jpg"
import Signup from "./Signup.vue"
import ListingForm from "../components/ListingForm.vue"

export default {
  components: {
    Signup,
    ListingForm,
  },
  name: "Welcome",
  data() {
    return {
      search: '',
      selectedCategory: '',
      popularTags: ['Strategy', 'Finance', 'Digital', 'Operations', 'Legal'],
      categories: [
        { icon: '💼', name: 'Business Strategy' },
        { icon: '📊', name: 'Financial Advisory' },
        { icon: '⚙️', name: 'Operations' },
        { icon: '🌍', name: 'Market Expansion' },
        { icon: '🤖', name: 'Digital & AI' },
        { icon: '⚖️', name: 'Legal & Compliance' },
        { icon: '🎓', name: 'Leadership' },
        { icon: '📣', name: 'Marketing' },
      ],
      products: [
        { name: "Industrial Solar Energy Project - 5MW", price: "Confidential", category: "Renewable Energy", image: solar },
        { name: "Commercial Warehouse Investment", price: "2,800,000 DT", category: "Real Estate", image: warehouse },
        { name: "Bulk Steel Supply Contract", price: "1,750,000 DT", category: "Industrial", image: steel },
        { name: "Business Strategy Consulting", price: "15,000 DT", category: "Consulting", image: consulting },
        { name: "Green Hydrogen Plant Project", price: "On Request", category: "Energy", image: hydrogen },
        { name: "Smart Logistics Software", price: "48,000 DT/yr", category: "Technology", image: logistics },
        { name: "Agricultural Export Partnership", price: "Negotiable", category: "Agriculture", image: agriculture },
        { name: "Data Center Infrastructure", price: "3,500,000 DT", category: "Technology", image: datacenter },
      ],
      features: [
        { icon: '🎯', title: 'The best talent', desc: 'Discover reliable professionals by exploring their portfolios and immersing yourself in their feedback.' },
        { icon: '⚡', title: 'Fast bids', desc: 'Get quick no-obligation quotes from skilled consultants. 80% of jobs receive bids within 60 seconds.' },
        { icon: '⭐', title: 'Quality work', desc: 'With our talent pool of over 2,500 professionals, you will find quality experts to get what you need done.' },
        { icon: '🎮', title: 'Be in control', desc: 'Stay in the loop while on the move. Chat with your consultants and get real time updates anytime, anywhere.' },
      ],
      steps: [
        { title: 'Post your project', desc: "It's free and easy! Get lots of competitive bids that suit your budget in minutes." },
        { title: 'Choose consultants', desc: 'No job is too big or complex. We have consultants for any size or budget across 500+ skills.' },
        { title: 'Pay safely', desc: 'Only pay for work when you are 100% satisfied. Our milestone payment system protects you every step.' },
        { title: "We're here to help", desc: 'Your time is precious. Let our team of expert recruiters save you time finding the right talent.' },
      ],
      skills: [
        'Business Strategy', 'Financial Advisory', 'Market Research', 'Operations',
        'Digital Transformation', 'Legal & Compliance', 'Leadership Coaching', 'Marketing',
        'Risk Management', 'Supply Chain', 'HR Consulting', 'IT Strategy',
        'Mergers & Acquisitions', 'Tax Advisory', 'Brand Strategy', 'Data Analytics',
        'Export Consulting', 'Investment Advisory', 'Process Optimization', 'Fundraising',
        'ESG Strategy', 'Real Estate', 'Logistics', 'Innovation'
      ],
      enterprise: [
        { icon: '🏢', title: 'Touskie Enterprise', desc: 'Company budget? Get more done for less. Use our network of experts to help your business achieve more.' },
        { icon: '🏆', title: 'Innovation Challenges', desc: 'Transform impossible challenges into breakthrough solutions through our global expert ecosystem.' },
        { icon: '🤖', title: 'AI Integration', desc: 'Millions of professionals on demand. Integrate our talented cloud workforce into your business processes.' },
      ],
      currentView: 'welcome',
      currentUser: JSON.parse(localStorage.getItem('user')) || null,
    }
  },
  computed: {
    isEnrolled() {
      return Boolean(this.currentUser)
    }
  },
  mounted() {
    this.checkPostProjectQuery()
  },
  watch: {
    '$route.query.postProject'(value) {
      if (value === '1') {
        this.currentView = 'signup'
      }
    }
  },
  methods: {
    handlePostProjectClick() {
      if (this.isEnrolled) {
        this.currentView = 'postProject'
      } else {
        this.currentView = 'signup'
      }
    },
    checkPostProjectQuery() {
      if (this.$route.query.postProject === '1') {
        this.currentView = 'signup'
      }
    },
    resetView() {
      this.currentView = 'welcome'
      if (this.$route.query.postProject) {
        this.$router.replace({ path: '/', query: {} })
      }
    },
    onSignupSuccess() {
      this.currentUser = JSON.parse(localStorage.getItem('user')) || null
      if (this.currentUser) {
        this.currentView = 'postProject'
        this.$router.replace({ path: '/', query: {} })
      } else {
        this.currentView = 'welcome'
      }
    },
    onListingCreated() {
      this.currentView = 'welcome'
    },
    addToListings(product) {
      import('../services/listingService.js').then(({ default: listingService }) => {
        const listing = {
          id: Date.now(),
          title: product.name,
          description: `Featured opportunity: ${product.name}`,
          price: product.price,
          publisher: "System",
          category: product.category,
          dateAdded: new Date().toLocaleDateString()
        }
        listingService.add(listing)
        this.$router.push('/listings')
      })
    }
  }
}
</script>