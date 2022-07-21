<template>
  <div class="container px-5 py-24 mx-auto">
    <div class="flex flex-col text-center w-full mb-20">
      <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Diari Jajan Dhiyo</h1>
      <p class="lg:w-2/3 mx-auto leading-relaxed text-base">Pengeluaran Bulan Ini {{ formatRupiah(total) }}</p>
      <button
          @click="onToggle"
          class="flex mx-auto mt-6 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
        Tambah Item
      </button>
      <transition name="fade">
        <div>
          <div v-if="!isModalVisible">
            <div
                @click="onToggle"
                class="absolute bg-black opacity-70 inset-0 z-0"
            />
            <div
                class="w-full max-w-lg p-3 relative mx-auto my-auto rounded-xl shadow-lg bg-white"
            >
              <div>
                <div class="text-left p-3 flex-auto justify-center leading-6">
                  <h2 class="text-2xl font-bold py-4">Tambah Entri</h2>
                  <div v-if="!alertOpen , errors.length > 0"
                       class="text-white px-6 py-4 border-0 rounded relative mb-4 bg-pink-500">
                    <span class="text-xl inline-block mr-5 align-middle">
                      <i class="fas fa-bell"></i>
                    </span>
                    <span v-for="error in errors" :key="error" class="inline-block align-middle mr-8">
                       <b class="capitalize">{{ error }}</b>
                    </span>
                    <button
                        class="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none"
                        v-on:click="!closeAlert()">
                      <span>×</span>
                    </button>
                  </div>
                  <div class="mb-3 pt-0">
                    <span class="text-left">Nama</span>
                    <input required v-model="nama" type="text" placeholder="Placeholder"
                           class="px-2 py-1 placeholder-slate-300 text-slate-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"/>
                  </div>
                  <div class="mb-3 pt-0 mt-2">
                    <span class="text-left">Harga</span>
                    <input required v-model="pengeluaraan" type="number" placeholder="Placeholder"
                           class="px-2 py-1 placeholder-slate-300 text-slate-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"/>
                  </div>
                </div>
                <div class="p-3 mt-2 text-center space-x-4 md:block">
                  <button
                      @click="onToggle"
                      class="mb-2 md:mb-0 bg-indigo-500 border border-purple-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-md hover:shadow-lg hover:bg-purple-600"
                  >
                    Close
                  </button>
                  <button
                      @click="addItem()"
                      class="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-md hover:shadow-lg hover:bg-gray-100"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <div class="flex flex-wrap -m-4 mt-10 ">
        <div v-for="detail of newDetails" class="xl:w-1/4 md:w-1/2 p-4">
          <div class="bg-gray-100 p-6 rounded-lg">
            <p class="mb-4 text-left text-bold">{{ dateFormat(detail.tanggal, 'DD MMMM YYYY') }}</p>
            <div v-for="datum of detail.data" class="flex border-t border-gray-200 py-2">
              <span class="text-gray-500">{{ datum.jam }}</span>
              <span class="ml-2 mr-2 text-gray-500">{{ datum.nama }}</span>
              <span class="ml-auto text-gray-900">{{ formatRupiah(datum.pengeluaraan) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {formatRupiah, dateFormat} from "../Utils/index.js";

export default {
  name: "Test",
  data() {
    return {
      details: [],
      newDetails: [],
      tempData: [],
      total: null,
      isOpen: false,
      spending: null,
      nama: "",
      pengeluaraan: null,
      jam: dateFormat(new Date(), 'HH:MM'),
      tanggal: dateFormat(new Date(), 'DD MMMM YYYY'),
      errors: [],
      alertOpen: false

    }
  },
  async created() {
    this.getAllItem()
  },

  computed: {
    isModalVisible() {
      return !this.isOpen;
    }
  },

  methods: {
    formatRupiah: formatRupiah,
    dateFormat: dateFormat,
    onToggle() {
      this.isOpen = !this.isOpen;
    },
    closeAlert () {
      this.alertOpen = true;
    },
    async getAllItem() {
      try {
        const res = await axios.get(`https://my-json-server.typicode.com/dhiyo7/Vue-Crud/detail`);
        this.details = res.data;
        let group_to_values = this.details.reduce(function (obj, item) {
          obj[item.tanggal] = obj[item.tanggal] || [];
          obj[item.tanggal].push(item);
          return obj;
        }, {});
        let groups = Object.keys(group_to_values).map(function (key) {
          return {tanggal: key, data: group_to_values[key]};
        });
        this.newDetails = groups

        let sum = this.newDetails.map((data, i) => {
          return data.data
        })
        this.tempData = sum.flat(1)

        let count = this.tempData.reduce((acc, obj) => {
          return acc + obj.pengeluaraan
        }, 0)
        this.total = count
      } catch (error) {
        console.log(error);
      }
    },
    async addItem() {
      this.errors = []
      if (!this.nama && !this.pengeluaraan || !this.nama || !this.pengeluaraan) {
        this.errors.push('Isi dulu yah...');
      }
      if (this.nama && this.pengeluaraan) {
        const res = await axios.post(`https://my-json-server.typicode.com/dhiyo7/Vue-Crud/detail`, {
          nama: this.nama,
          pengeluaraan: this.pengeluaraan,
          jam: this.jam,
          tanggal: this.tanggal
        }).then(() => this.getAllItem()).then(() => this.onToggle()
        ).then(() => this.nama = "",
            this.pengeluaraan = "",
            this.jam = "",
            this.tanggal = "");
        this.details = [...this.details, res.data];
      }
    }
  }
}
</script>

<style scoped>

</style>
