<template>
  <div class="lds-dual-ring"></div>
</template>

<script>
export default {
  name: 'BaseSmallPreloader',
};
</script>

<style scoped>
 .lds-dual-ring {
  display: inline-block;
  width: 25px;
  height: 25px;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 25px;
  height: 25px;
  margin: 3px;
  border-radius: 50%;
  border: 3px solid #e02d71;
  border-color: #e02d71 transparent #e02d71 transparent;
  animation: lds-dual-ring 1.9s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
